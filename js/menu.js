var menuState = {
    checkDecoded: true,
    create: function() {
        var background = game.add.sprite(0, 0, 'background');
        background.inputEnabled = true;
        var nameLabel = game.add.text(game.world.centerX, -100, 'Super Coin Box', { font: '100px Geo', fill: '#ffffff' });
        nameLabel.anchor.setTo(0.5, 0.5);
        var scoreLabel = game.add.text(game.world.centerX, game.world.centerY,
            'score: ' + game.global.score,
            { font: '40px Arial', fill: '#ffffff' });
        scoreLabel.anchor.setTo(0.5, 0.5);
        if (game.device.desktop) {
            var text = 'press the up arrow key to start';
        } else {
            var text = 'touch the screen to start';
        }
        var startLabel = game.add.text(game.world.centerX, game.world.height-120,
            text,
            { font: '40px Arial', fill: '#ffffff' });
        startLabel.anchor.setTo(0.5, 0.5);
        startLabel.angle = 2;
        var upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        upKey.onDown.addOnce(this.start, this);

        if (this.checkDecoded) {
            this.musicLoadingLabel = game.add.text(game.world.centerX, game.world.height - 18, "Loading music...",
                { font: "14px Arial", fill: "#ffffff" });
            this.musicLoadingLabel.anchor.setTo(0.5, 0.5);
        }

        game.add.tween(nameLabel).to({y: 80}, 700).easing(Phaser.Easing.Bounce.Out).start();
        game.add.tween(startLabel).to({angle: -2}, 500).to({angle: 2}, 500).loop().start();

        this.music = game.add.audio('music');

        this.muteButton = game.add.button(40, 40, 'mute', this.toggleSound, this);
        this.muteButton.input.useHandCursor = true;

        if (game.sound.mute) {
            this.muteButton.frame = 1;
        }

        var shopText = game.device.desktop ? "Press the Down Arrow key to shop" : "Tap to shop";
        this.shopButton = game.add.text(game.world.centerX, game.world.height - 200, shopText, { font: "36px Arial", fill: "#ffffff" });
        this.shopButton.anchor.setTo(0.5, 0.5);
        this.shopButton.inputEnabled = true;
        this.shopButton.events.onInputDown.addOnce(this.shop, this);
        var downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        downKey.onDown.addOnce(this.shop, this);

        background.events.onInputDown.add(this.start, this);
    },
    shop: function() {
        game.state.start("shop");
    },
    toggleSound: function() {
        game.sound.mute = ! game.sound.mute;
        this.muteButton.frame = game.sound.mute ? 1 : 0;
    },
    start: function() {
        game.state.start('play');
    },
    update: function() {
        if (this.checkDecoded && !this.music.isDecoding) {
            game.world.remove(this.musicLoadingLabel);
            this.checkDecoded = false;
        }
    }
};
