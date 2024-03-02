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
  }

  /**
   * Called once. Create any objects you need here!
   */
  create() {
    // TODO: create the player

    // TODO: implement gravity

    // TODO: make arrow keys work

    // TODO: initialize walls

    // TODO: add wall collison logic

    // TODO: add coin

    // TODO: add score counter
  }

  /**
   * Creates the walls of the game
   */
  createWalls() {
    // TODO: add walls
  }

  /**
   * Phaser calls this function once a frame (60 times a second).
   *
   * Use this function to move the player in response to actions,
   * check for win conditions, etc.
   */
  update() {
    // TODO: implement update game state 
  }

  /**
   * Handles moving the player with the arrow keys
   */
  movePlayer() {
    // TODO: implement player movement
  }

  /**
   * Check to see whether the player has collided with any coins
   */
  checkCoinCollisions() {
    // TODO: implement coin collision logic
  }

  /**
   * Move the coin to a different random location
   */
  moveCoin() {
    // TODO: move coin when picked up
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
