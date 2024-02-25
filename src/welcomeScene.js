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
      -100,
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

    this.tweens
      .chain({
        targets: startLabel,
        tweens: [
          {
            angle: -2,
            duration: 500,
          },
          {
            angle: 2,
            duration: 500,
          },
        ],
        loop: -1, // loop indefinitely
      });

    this.tweens
      .add({
        targets: nameLabel,
        y: 150,
        duration: 1200,
        ease: "Bounce.Out",
      });
  }
}

export default WelcomeScene;
