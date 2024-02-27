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

// Ignore this for now!! You'll use this for the createWalls() function.

/*
this.walls.create(10, 170, "wallVertical"); // Left
this.walls.create(490, 170, "wallVertical"); // Right

this.walls.create(50, 10, "wallHorizontal"); // Top left
this.walls.create(450, 10, "wallHorizontal"); // Top right
this.walls.create(50, 330, "wallHorizontal"); // Bottom left
this.walls.create(450, 330, "wallHorizontal"); // Bottom right

this.walls.create(0, 170, "wallHorizontal"); // Middle left
this.walls.create(500, 170, "wallHorizontal"); // Middle right
this.walls.create(250, 90, "wallHorizontal"); // Middle top
this.walls.create(250, 250, "wallHorizontal"); // Middle botto
*/
