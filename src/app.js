import Phaser from "phaser";

class GameScene extends Phaser.Scene {
  /**
   * Load any assets you might need here!
   */
  preload() {
    this.load.image("player", "assets/player.png");

    this.load.image("wallHorizontal", "assets/wallHorizontal.png");
    this.load.image("wallVertical", "assets/wallVertical.png");

    this.load.image("coin", "assets/coin.png");
    this.load.image("enemy", "assets/enemy.png");

    this.load.audio("jump", ["assets/jump.ogg", "assets/jump.mp3"]);
    this.load.audio("coin", ["assets/coin.ogg", "assets/coin.mp3"]);
    this.load.audio("dead", ["assets/dead.ogg", "assets/dead.mp3"]);
  }

  /**
   * Called once. Create any objects you need here!
   */
  create() {
    // create the player sprite
    this.player = this.physics.add.sprite(250, 170, "player");

    // add gravity to make the player fall
    this.player.body.gravity.y = 500;

    // create arrow keys
    this.cursors = this.input.keyboard.createCursorKeys();

    this.createWalls();

    // Make the player collide with walls
    this.physics.add.collider(this.player, this.walls);

    this.coin = this.physics.add.sprite(60, 130, "coin");

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
  }

  /**
   * Creates the walls of the game
   */
  createWalls() {
    this.walls = this.physics.add.staticGroup();

    this.walls.create(10, 170, "wallVertical"); // Left
    this.walls.create(490, 170, "wallVertical"); // Right

    this.walls.create(50, 10, "wallHorizontal"); // Top left
    this.walls.create(450, 10, "wallHorizontal"); // Top right
    this.walls.create(50, 330, "wallHorizontal"); // Bottom left
    this.walls.create(450, 330, "wallHorizontal"); // Bottom right

    this.walls.create(0, 170, "wallHorizontal"); // Middle left
    this.walls.create(500, 170, "wallHorizontal"); // Middle right
    this.walls.create(250, 90, "wallHorizontal"); // Middle top
    this.walls.create(250, 250, "wallHorizontal"); // Middle bottom
  }

  /**
   * Phaser calls this function once a frame (60 times a second).
   *
   * Use this function to move the player in response to actions,
   * check for win conditions, etc.
   */
  update() {
    this.movePlayer();
    this.checkCoinCollisions();

    // If the player goes out of bounds (ie. falls through a hole),
    // the player dies
    if (this.player.y > 340 || this.player.y < 0) {
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
    } else if (this.cursors.right.isDown) {
      // move right
      this.player.body.velocity.x = 200;
    } else {
      // stop moving in the horizontal
      this.player.body.velocity.x = 0;
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
      { x: 140, y: 60 },
      { x: 360, y: 60 },
      { x: 60, y: 140 },
      { x: 440, y: 140 },
      { x: 130, y: 300 },
      { x: 370, y: 300 },
    ];

    // don't move to the same location it was already at
    positions = positions.filter((p) => !(p.x === this.coin.x && p.y === this.coin.y));

    let newPosition = Phaser.Math.RND.pick(positions);
    this.coin.setPosition(newPosition.x, newPosition.y);
  }

  /**
   * Create a new enemy
   */
  addEnemy() {
    // create the enemy sprite at (250, -10)
    let enemy = this.enemies.create(250, -10, "enemy");

    // add gravity to the enemy to make it fall
    enemy.body.gravity.y = 500;
    // randomly make the enemy move left or right
    enemy.body.velocity.x = Phaser.Math.RND.pick([-200, 200]);
    // when the enemy hits a left or right wall, we want it to
    // bounce back in the opposite direction without losing speed
    enemy.body.bounce.x = 1;

    // destroy the enemy after 10 seconds
    // this is roughly how long it takes to fall through the hole
    this.time.addEvent({
      delay: 10000,
      callback: () => enemy.destroy(),
    });
  }

  /**
   * Called when the player dies. Restart the game
   */
  handlePlayerDeath() {
    this.scene.restart();
    this.deadSound.play();
  }
}


const config = {
  type: Phaser.AUTO,
  width: 500,
  height: 340,
  scene: GameScene,
  physics: {
    default: "arcade",
  },
  backgroundColor: "#3498db",
};

const game = new Phaser.Game(config);
