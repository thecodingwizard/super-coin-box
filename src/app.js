import Phaser from "phaser";

class GameScene extends Phaser.Scene {
  /**
   * Load any assets you might need here!
   */
  preload() {
    this.load.image("player", "assets/player.png");

    this.load.image("wallHorizontal", "assets/wallHorizontal.png");
    this.load.image("wallVertical", "assets/wallVertical.png");
  }

  /**
   * Called once. Create any objects you need here!
   */
  create() {
    // create the player sprite
    this.player = this.physics.add.sprite(250, 170, "player");

    // add gravity to make the player fall
    this.player.body.gravity.y = 500;

    // create cursor keys
    this.cursors = this.input.keyboard.createCursorKeys();

    this.createWalls();

    // Make the player collide with walls
    this.physics.add.collider(this.player, this.walls);
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
    }
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
  backgroundColor: '#3498db',
};

const game = new Phaser.Game(config);
