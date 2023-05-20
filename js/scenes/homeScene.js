class homeScene extends Phaser.Scene {
    constructor() {
        super('homeScene');
    }

    create() {
        var bg = this.add.sprite(0, 0, 'backyard').setInteractive();
        bg.setOrigin(0, 0);

        var gameW = this.sys.game.config.width;
        var gameH = this.sys.game.config.height;
        var text = this.add.text(gameW / 2, gameH / 2, 'El nostre primer videojoc', {
            font: '40px Arial',
            fill: '#ffffff'
        });
        text.setOrigin(0.5, 0.5);
        text.depth = 1;

        var textBg = this.add.graphics();
        textBg.fillStyle(0x000000, 0.7);
        textBg.fillRect(gameW / 2 - text.width / 2 - 10, gameH / 2 - text.height / 2 - 10, text.width + 20, text.height + 20);

        bg.on('pointerdown', function () {
            this.scene.start('gameScene');
        }, this);
    }

}