module.exports = function(game) {
    return {
        preload: function() {
            game.global.modal.createModal({
                type:"notEnoughMoney",
                includeBackground: true,
                modalCloseOnInput: true,
                itemsArr: [
                    {
                        type: "text",
                        content: "Not Enough Money!",
                        fontFamily: "Arial",
                        fontSize: 42,
                        color: "0xFEFF49",
                        offsetY: -50
                    }
                ]
            });
        },
        create: function() {
            var title = game.add.text(game.world.centerX, -100, "Shop", { font: "100px Geo", fill: "#ffffff" });
            title.anchor.setTo(0.5, 0.5);
            game.add.tween(title).to({y: 80}, 700).easing(Phaser.Easing.Bounce.Out).start();

            var backBtn = game.add.button(50, 50, "backButton", this.back);
            backBtn.scale.setTo(0.3, 0.3);

            this.coinsLabel = game.add.text(game.world.width - 50, 50, "Coins: " + game.global.get("coins"), { font: "36px Arial", fill: "#ffffff" });
            this.coinsLabel.anchor.setTo(1, 0);

            var shopGroup = game.add.group();
            shopGroup.x = 50;
            shopGroup.y = 140;
            var moreLivesGroup = game.add.group();
            var moreLivesImg = moreLivesGroup.create(0, 0, "moreLives");
            this.addClickListener(moreLivesImg, this.moreLives);
            this.moreLivesText = game.add.text(50, 100, "",  { font: "18px Arial", fill: "#ffffff" });
            this.setMoreLivesText();
            this.moreLivesText.anchor.setTo(0.5, 0);
            this.addClickListener(this.moreLivesText, this.moreLives);
            moreLivesGroup.add(this.moreLivesText);
            shopGroup.add(moreLivesGroup);
        },
        setMoreLivesText: function() {
            this.moreLivesText.setText("More Lives $" + this.getMoreLivesCost());
        },
        getMoreLivesCost: function() {
            return (game.global.get("lives") - 3)*20 + 10;
        },
        moreLives: function() {
            if (game.global.get("coins") >= this.getMoreLivesCost()) {
                this.updateCoins(game.global.get("coins") - this.getMoreLivesCost());
                game.global.set("lives", game.global.get("lives") + 1);
                this.setMoreLivesText();
            } else {
                game.global.modal.showModal("notEnoughMoney");
            }
        },
        updateCoins: function(coins) {
            game.global.set("coins", coins);
            this.coinsLabel.setText("Coins: " + game.global.get("coins"));
        },
        addClickListener: function(item, callback) {
            item.inputEnabled = true;
            item.input.useHandCursor = true;
            item.events.onInputDown.add(callback, this);
        },
        update: function() {

        },
        back: function() {
            game.state.start("menu");
        }
    };
};
