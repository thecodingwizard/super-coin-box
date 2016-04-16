var shopState = {
    preload: function() {

    },
    create: function() {
        var title = game.add.text(game.world.centerX, -100, "Shop", { font: "100px Geo", fill: "#ffffff" });
        title.anchor.setTo(0.5, 0.5);
        game.add.tween(title).to({y: 80}, 700).easing(Phaser.Easing.Bounce.Out).start();

        var backBtn = game.add.button(50, 50, "backButton", this.back);
        backBtn.scale.setTo(0.3, 0.3);

        var coinsLabel = game.add.text(game.world.width - 50, 50, "Coins: " + game.global.coins, { font: "36px Arial", fill: "#ffffff" });
        coinsLabel.anchor.setTo(1, 0);
    },
    update: function() {

    },
    back: function() {
        game.state.start("menu");
    }
}
