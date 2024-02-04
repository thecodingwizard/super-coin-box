import Phaser from "phaser";

class WelcomeScene extends Phaser.Scene {
  constructor() {
    super("WelcomeScene");
  }

  preload() {
    this.load.image("background", "assets/background.png");
  }

  create() {
    let background = this.add.sprite(0, 0, "background");
    background.setOrigin(0, 0);

    let nameLabel = this.add.text(
      this.game.config.width / 2,
      150,
      "Super Coin Box",
      { font: "100px Geo", fill: "#ffffff" },
    );
    nameLabel.setOrigin(0.5, 0.5);

    var startLabel = this.add.text(
      this.game.config.width / 2,
      this.game.config.height - 150,
      "press the up arrow key to start",
      { font: "40px Arial", fill: "#ffffff" },
    );
    startLabel.setOrigin(0.5, 0.5);

    this.downArrow = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.UP,
    );
    this.downArrow.on("up", () => {
      this.scene.start("GameScene");
    });
  }
}

export default WelcomeScene;
