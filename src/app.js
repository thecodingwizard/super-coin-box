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
