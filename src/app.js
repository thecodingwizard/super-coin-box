import Phaser from "phaser";

class GameScene extends Phaser.Scene {
  /**
   * Load any assets you might need here!
   */
  preload() {
    this.load.spritesheet("player", "assets/player2.png", {
      frameWidth: 20,
      frameHeight: 20,
    });

    this.load.image("tileset", "assets/tileset.png");
    // created with Tiled tilemap editor
    this.load.tilemapTiledJSON("map", "assets/map.json");

    this.load.image("coin", "assets/coin.png");
    this.load.image("enemy", "assets/enemy.png");

    this.load.audio("jump", ["assets/jump.ogg", "assets/jump.mp3"]);
    this.load.audio("coin", ["assets/coin.ogg", "assets/coin.mp3"]);
    this.load.audio("dead", ["assets/dead.ogg", "assets/dead.mp3"]);

    this.load.image("pixel", "assets/pixel.png");
  }

  /**
   * Called once. Create any objects you need here!
   */
  create() {
    // create the player sprite
    this.player = this.physics.add.sprite(this.game.config.width / 2, this.game.config.height / 2, "player");

    // player movement animations
    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("player", {frames: [1, 2]}),
      frameRate: 8,
      repeat: -1,
    });
    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("player", {frames: [3, 4]}),
      frameRate: 8,
      repeat: -1,
    });

    // add gravity to make the player fall
    this.player.body.gravity.y = 500;

    // create arrow keys
    this.cursors = this.input.keyboard.createCursorKeys();

    this.createWalls();

    // Make the player collide with walls
    this.physics.add.collider(this.player, this.walls);

    this.coin = this.physics.add.sprite(0, 0, "coin");
    this.moveCoin();

    // Display the score
    this.scoreLabel = this.add.text(30, 25, "score: 0", {
      font: "18px Arial",
      fill: "#ffffff",
    });

    this.score = 0;

    // add enemies!
    this.enemies = this.physics.add.group();
    // call this.addEnemy() once every 2.2 seconds
    this.time.addEvent({
      delay: 2200,
      callback: () => this.addEnemy(),
      loop: true,
    });
    // Make the enemies and walls collide
    this.physics.add.collider(this.enemies, this.walls);
    // If the player collides with an enemy, restart the game
    this.physics.add.collider(this.player, this.enemies, () => {
      this.handlePlayerDeath();
    });

    this.jumpSound = this.sound.add("jump");
    this.coinSound = this.sound.add("coin");
    this.deadSound = this.sound.add("dead");

    // particles for when the player dies
    // the initial location doesn't matter -- we'll set the location
    // in handlePlayerDeath()
    this.emitter = this.add.particles(0, 0, "pixel", {
      // how many particles
      quantity: 15,
      // min/max speed of the particles, in pixels per second
      speed: { min: -150, max: 150 },
      // scale the particles from 2x original size to 0.1x
      scale: { start: 2, end: 0.1 },
      // how long the particles last, milliseconds
      lifespan: 800,
      // don't start the explosion right away
      emitting: false,
    });
  }

  /**
   * Creates the walls of the game
   */
  createWalls() {
    // create the tilemap
    let map = this.add.tilemap("map");

    // Add the tileset to the map
    // the first parameter is the name of the tileset in Tiled
    // the second parameter is the name of the tileset in preload()
    let tileset = map.addTilesetImage("tileset", "tileset");
    this.walls = map.createLayer("Level 1", tileset);

    // Enable collisions for the first tile (the blue walls)
    this.walls.setCollision(1);
  }

  /**
   * Phaser calls this function once a frame (60 times a second).
   *
   * Use this function to move the player in response to actions,
   * check for win conditions, etc.
   */
  update() {
    if (!this.player.active) {
      // the player is dead
      return;
    }

    this.movePlayer();
    this.checkCoinCollisions();

    // If the player goes out of bounds (ie. falls through a hole),
    // the player dies
    if (this.player.y > this.game.config.height || this.player.y < 0) {
      this.handlePlayerDeath();
    }
  }

  /**
   * Handles moving the player with the arrow keys
   */
  movePlayer() {
    // check for active input
    if (this.cursors.left.isDown) {
      // move left
      this.player.body.velocity.x = -200;
      this.player.anims.play("left", true);
    } else if (this.cursors.right.isDown) {
      // move right
      this.player.body.velocity.x = 200;
      this.player.anims.play("right", true);
    } else {
      // stop moving in the horizontal
      this.player.body.velocity.x = 0;
      this.player.setFrame(0);
    }

    if (this.cursors.up.isDown && this.player.body.onFloor()) {
      // jump if the player is on the ground
      this.player.body.velocity.y = -320;
      this.jumpSound.play();
    }
  }

  /**
   * Check to see whether the player has collided with any coins
   */
  checkCoinCollisions() {
    if (this.physics.overlap(this.player, this.coin)) {
      // the player has taken a coin!
      // add 5 to the score
      this.score += 5;
      // update the score label
      this.scoreLabel.setText("score: " + this.score);
      // move the coin to a new spot
      this.moveCoin();
      this.coinSound.play();
    }
  }

  /**
   * Move the coin to a different random location
   */
  moveCoin() {
    // these are the possible positions the coin can move to
    let positions = [
      {x: 120, y: 135}, {x: 680, y: 135},
      {x: 120, y: 295}, {x: 680, y: 295},
      {x: 120, y: 455}, {x: 680, y: 455}
    ];

    // don't move to the same location it was already at
    positions = positions.filter((p) => !(p.x === this.coin.x && p.y === this.coin.y));

    let newPosition = Phaser.Math.RND.pick(positions);
    this.coin.setPosition(newPosition.x, newPosition.y);
    this.coin.setScale(0);

    this.tweens.add({
      targets: this.coin,
      scale: 1,
      duration: 300,
    });
    this.tweens.add({
      targets: this.player,
      scale: 1.3,
      duration: 100,
      yoyo: true, // perform the tween forward then backward
    });
  }

  /**
   * Create a new enemy
   */
  addEnemy() {
    let enemy = this.enemies.create(this.game.config.width / 2, 0, "enemy");

    // add gravity to the enemy to make it fall
    enemy.body.gravity.y = 500;
    // randomly make the enemy move left or right
    enemy.body.velocity.x = Phaser.Math.RND.pick([-200, 200]);
    // when the enemy hits a left or right wall, we want it to
    // bounce back in the opposite direction without losing speed
    enemy.body.bounce.x = 1;

    // destroy the enemy after 15 seconds
    // this is roughly how long it takes to fall through the hole
    this.time.addEvent({
      delay: 15000,
      callback: () => enemy.destroy(),
    });
  }

  /**
   * Called when the player dies. Restart the game
   */
  handlePlayerDeath() {
    this.deadSound.play();
    this.emitter.explode(this.emitter.quantity, this.player.x, this.player.y);
    
    // we can't immediately restart the scene; otherwise our particles will disappear
    // delete the player
    this.player.destroy();
    // delete all the enemies
    this.enemies.clear(true, true);
    this.time.addEvent({
      delay: 1000,
      callback: () => this.scene.restart()
    });
  }
}


const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 560,
  scene: GameScene,
  physics: {
    default: "arcade",
  },
  backgroundColor: "#3498db",
};

const game = new Phaser.Game(config);
