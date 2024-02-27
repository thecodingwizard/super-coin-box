import Phaser from "phaser";

class GameScene extends Phaser.Scene {
  preload() {
    // Your code here!
  }

  create() {
    // Your code here!
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
