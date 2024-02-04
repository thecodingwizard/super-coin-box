import Phaser from "phaser";
import GameScene from "./gameScene";
import WelcomeScene from "./welcomeScene";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 560,
  scene: [WelcomeScene, GameScene],
  physics: {
    default: "arcade",
  },
  backgroundColor: "#3498db",
};

const game = new Phaser.Game(config);
