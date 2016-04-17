function trackJavaScriptError(e) {
    var errMsg = e.message;
    var errSrc = e.filename + ': ' + e.lineno;
    if (window.location.href.indexOf("localhost") == -1) {
        ga("send", "event", "Unhandled Error", errMsg, errSrc);
        console.log("Error caught by google analytics");
    } else {
        console.log("Localhost, not sending error...");
    }
}
window.addEventListener('error', trackJavaScriptError, false);

// Initialise Phaser
var game = new Phaser.Game(800, 560, Phaser.AUTO, "game");

var gameModal = require("./modal.js");
var bootState = require("./boot.js")(game);
var loadState = require("./load.js")(game);
var menuState = require("./menu.js")(game);
var playState = require("./play.js")(game);
var shopState = require("./shop.js")(game);

// Define our 'global' variable
game.global = {
    score: 0,
    coins: window.localStorage.coins || 0,
    modal: new gameModal(game)
};
// Add all the states
game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('shop', shopState);
game.state.add('menu', menuState);
game.state.add('play', playState);
// Start the 'boot' state
game.state.start('boot');
