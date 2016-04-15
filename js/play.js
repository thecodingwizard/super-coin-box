var playState = {
    level: 1,
    maxLevel: 2,
    coinPositions: [
        {x: 120, y: 120}, {x: 680, y: 120},
        {x: 120, y: 280}, {x: 680, y: 280},
        {x: 120, y: 440}, {x: 680, y: 440}
    ],
    create: function() {
        this.cursor = game.input.keyboard.createCursorKeys();

        this.player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');
        this.player.anchor.setTo(0.5, 0.5);
        game.physics.arcade.enable(this.player);
        this.player.body.gravity.y = 500;
        this.player.animations.add('right', [1, 2], 8, true);
        this.player.animations.add('left', [3, 4], 8, true);

        this.enemies = game.add.group();
        this.enemies.enableBody = true;
        this.enemies.createMultiple(30, 'enemy');

        this.coin = game.add.sprite(0, 0, 'coin');
        this.updateCoinPosition();
        game.physics.arcade.enable(this.coin);

        // game.add.sprite(120, 120, 'coin');
        // game.add.sprite(680, 120, 'coin');
        // game.add.sprite(120, 280, 'coin');
        // game.add.sprite(680, 280, 'coin');
        // game.add.sprite(120, 440, 'coin');
        // game.add.sprite(680, 440, 'coin');

        this.scoreLabel = game.add.text(30, 30, 'score: 0', { font: '24px Arial', fill: '#ffffff' });
        game.global.score = 0;

        this.jumpSound = game.add.audio('jump');
        this.coinSound = game.add.audio('coin');
        this.deadSound = game.add.audio('dead');

        this.emitter = game.add.emitter(0, 0, 15);
        this.emitter.makeParticles('pixel');
        this.emitter.setYSpeed(-150, 150);
        this.emitter.setXSpeed(-150, 150);
        this.emitter.gravity = 0;

        this.music = game.add.audio('music');
        this.music.loop = true;
        this.music.volume = 0.5;
        this.music.play();

        this.createWorld();

        this.nextEnemy = 0;

        game.input.keyboard.addKeyCapture([Phaser.Keyboard.UP, Phaser.Keyboard.DOWN, Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT]);

        this.wasd = {
            up: game.input.keyboard.addKey(Phaser.Keyboard.W),
            left: game.input.keyboard.addKey(Phaser.Keyboard.A),
            right: game.input.keyboard.addKey(Phaser.Keyboard.D)
        };

        if (!game.device.desktop) {
            // Display the mobile inputs
            this.addMobileInputs();
        }
    },
    addMobileInputs: function() {
        // Add the jump button
        this.jumpButton = game.add.sprite(350, 247, 'jumpButton');
        this.jumpButton.inputEnabled = true;
        this.jumpButton.alpha = 0.5;

        this.moveLeft = false;
        this.moveRight = false;

        // Add the move left button
        this.leftButton = game.add.sprite(50, 247, 'leftButton');
        this.leftButton.inputEnabled = true;
        this.leftButton.events.onInputOver.add(function(){this.moveLeft=true;}, this);
        this.leftButton.events.onInputOut.add(function(){this.moveLeft=false;}, this);
        this.leftButton.events.onInputDown.add(function(){this.moveLeft=true;}, this);
        this.leftButton.events.onInputUp.add(function(){this.moveLeft=false;}, this);
        this.leftButton.alpha = 0.5;
        // Add the move right button
        this.rightButton = game.add.sprite(130, 247, 'rightButton');
        this.rightButton.inputEnabled = true;
        this.rightButton.events.onInputOver.add(function(){this.moveRight=true;}, this);
        this.rightButton.events.onInputOut.add(function(){this.moveRight=false;}, this);
        this.rightButton.events.onInputDown.add(function(){this.moveRight=true;}, this);
        this.rightButton.events.onInputUp.add(function(){this.moveRight=false;}, this);
        this.rightButton.alpha = 0.5;

        this.jumpButton.events.onInputDown.add(this.jumpPlayer, this);
    },
    createWorld: function() {
        this.map = game.add.tilemap('map');
        this.map.addTilesetImage('tileset');
        this.layer = this.map.createLayer('Level ' + this.level);
        this.layer.resizeWorld();
        this.map.setCollision(1);
    },
    levelUp: function() {
        if (this.level >= this.maxLevel) return;
        this.level++;
        this.layer.destroy();
        this.enemies.forEachAlive(function(enemy) { enemy.kill() });
        this.player.x = game.world.centerX;
        this.player.y = game.world.centerY;
        this.layer = this.map.createLayer('Level ' + this.level);
        this.layer.resizeWorld();
        this.map.setCollision(1, true, this.layer);
    },
    addEnemy: function() {
        var enemy = this.enemies.getFirstDead();
        if (!enemy) return;
        enemy.anchor.setTo(0.5, 1);
        enemy.reset(game.world.centerX, 0);
        enemy.body.gravity.y = 500;
        enemy.body.velocity.x = 100 * (Math.random() > 0.5 == 1 ? -1 : 1);
        enemy.body.bounce.x = 1;
        enemy.checkWorldBounds = true;
        enemy.outOfBoundsKill = true;
    },
    update: function() {
        game.physics.arcade.collide(this.player, this.layer);
        game.physics.arcade.collide(this.enemies, this.layer);
        game.physics.arcade.overlap(this.player, this.coin, this.takeCoin, null, this);
        game.physics.arcade.overlap(this.player, this.enemies, this.playerDie, null, this);
        this.movePlayer();
        if (!this.player.inWorld) {
            this.playerDie();
        }

        if (this.nextEnemy < game.time.now) {
            var start = 4000, end = 1000, score = 100;
            var delay = Math.max(start - (start-end)*game.global.score/score, end);
            this.addEnemy();
            this.nextEnemy = game.time.now + delay;
        }
    },
    movePlayer: function() {
        if (this.cursor.left.isDown || this.wasd.left.isDown || this.moveLeft) {
            this.player.body.velocity.x = -200;
            this.player.animations.play('left');
        } else if (this.cursor.right.isDown || this.wasd.right.isDown || this.moveRight) {
            this.player.body.velocity.x = 200;
            this.player.animations.play('right');
        } else {
            this.player.body.velocity.x = 0;
            this.player.frame = 0;
        }
        if (this.cursor.up.isDown || this.wasd.up.isDown) {
            this.jumpPlayer();
        }
    },
    takeCoin: function(player, coin) {
        game.global.score += 5;
        this.scoreLabel.text = 'score: ' + game.global.score;
        this.coinSound.play();
        this.updateCoinPosition();

        if (game.global.score % 50 == 0) {
            this.levelUp();
        }

        this.coin.scale.setTo(0, 0);
        game.add.tween(this.coin.scale).to({x: 1, y: 1}, 300).start();

        game.add.tween(this.player.scale).to({x: 1.3, y: 1.3}, 50).to({x: 1, y: 1}, 150).start();
    },
    updateCoinPosition: function() {
        var spliced;
        for (var i = 0; i < this.coinPositions.length; i++) {
            if (this.coinPositions[i].x === this.coin.x && this.coinPositions[i].y == this.coin.y) {
                var spliced = this.coinPositions.splice(i, 1);
            }
        }
        var newPosition = this.coinPositions[game.rnd.integerInRange(0, this.coinPositions.length-1)];
        if (spliced != null) this.coinPositions.push(spliced[0]);
        this.coin.reset(newPosition.x, newPosition.y);
    },
    playerDie: function() {
        if (!this.player.alive) {
            return;
        }
        this.player.kill();
        this.music.stop();
        this.deadSound.play();
        this.emitter.x = this.player.x;
        this.emitter.y = this.player.y;
        this.emitter.start(true, 600, null, 15);
        game.time.events.add(1000, this.startMenu, this);
    },
    jumpPlayer: function() {
        // If the player is touching the ground
        if (this.player.body.onFloor()) {
            // Jump with sound
            this.player.body.velocity.y = -320;
            this.jumpSound.play();
        }
    },
    startMenu: function() {
        game.state.start('menu');
    }
};
