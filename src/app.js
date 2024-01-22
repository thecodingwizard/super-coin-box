import Phaser from "phaser";

class GameScene extends Phaser.Scene {
  preload() {
    this.load.image("player", "assets/player.png");
  }

  create() {
    // create the player sprite
    this.player = this.physics.add.sprite(250, 170, "player");

    // add gravity to make the player fall
    this.player.body.gravity.y = 500;

    // create cursor keys
    this.cursors = this.input.keyboard.createCursorKeys();
  }

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
