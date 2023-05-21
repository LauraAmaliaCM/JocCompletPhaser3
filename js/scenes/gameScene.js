class gameScene extends Phaser.Scene {
    constructor() {
        super('gameScene');
    }

    create() {

        //  Un fons senzill per al nostre joc
        this.add.image(400, 300, 'sky');

        //  El grup de plataformes conté el terra i els 2 ressalts sobre els quals podem saltar
        platforms = this.physics.add.staticGroup();

        // Aquí creem el terreny.
        // Cal escalar-lo per a que s'adapti a l'amplada del joc (l'sprite original té una mida de 400x32)
        platforms.create(400, 568, 'ground').setScale(2).refreshBody();

        //  Ara crearem algunes plataformes
        platforms.create(600, 400, 'ground');
        platforms.create(50, 250, 'ground');
        platforms.create(750, 220, 'ground');

        // El jugador i la seva configuració
        player = this.physics.add.sprite(100, 450, 'dude');

        //  Propietats de la física del jugador. Afegeix un petit rebot al jugador en caure.
        player.setBounce(0.2);
        player.setCollideWorldBounds(true);

        //  Les animacions dels nostres jugadors, girant, caminant a l’esquerra i caminant a la dreta.
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [{ key: 'dude', frame: 4 }],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        //  Events d'entrada amb el teclat
        cursors = this.input.keyboard.createCursorKeys();

        //  Algunes estrelles per recollir, 12 en total, separades uniformement a 70 píxels al llarg de l'eix X
        stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
        });

        stars.children.iterate(function (child) {

            //  Cada estrella fa un rebot lleugerament diferent
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

        });

        bombs = this.physics.add.group();

        //  La puntuació
        scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

        //  Xoca el jugador i les estrelles amb les plataformes
        this.physics.add.collider(player, platforms);
        this.physics.add.collider(stars, platforms);
        this.physics.add.collider(bombs, platforms);

        //  Comprova si el jugador col·lisiona amb alguna de les estrelles, si crida ho fa, a la funció collectStar
        this.physics.add.overlap(player, stars, this.collectStar, null, this);

        this.physics.add.collider(player, bombs, this.hitBomb, null, this);
    }

    update() {
        // Codi on fem moure el personatge
        if (gameOver) {
            return;
        }

        if (cursors.left.isDown) {
            player.setVelocityX(-160);

            player.anims.play('left', true);
        }
        else if (cursors.right.isDown) {
            player.setVelocityX(160);

            player.anims.play('right', true);
        }
        else {
            player.setVelocityX(0);

            player.anims.play('turn');
        }

        if (cursors.up.isDown && player.body.touching.down) {
            player.setVelocityY(-330);
        }
    }

    collectStar(player, star) {
        star.disableBody(true, true);

        //  Afegeix i actualitza la puntuació
        score += 10;
        scoreText.setText('Score: ' + score);

        if (stars.countActive(true) === 0) {
            //  Un nou lot d’estrelles per a col·leccionar
            stars.children.iterate(function (child) {

                child.enableBody(true, child.x, 0, true, true);

            });

            var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

            var bomb = bombs.create(x, 16, 'bomb');
            bomb.setBounce(1);
            bomb.setCollideWorldBounds(true);
            bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
            bomb.allowGravity = false;

        }
    }

    hitBomb(player, bomb) {
        this.physics.pause();

        player.setTint(0xff0000);

        player.anims.play('turn');

        gameOver = true;
    }
}
