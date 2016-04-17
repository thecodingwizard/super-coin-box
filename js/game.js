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

if (typeof localStorage === 'object') {
    try {
        localStorage.setItem('localStorage', 1);
        localStorage.removeItem('localStorage');
    } catch (e) {
        Storage.prototype._setItem = Storage.prototype.setItem;
        Storage.prototype.setItem = function() {};
        alert('Your web browser does not support storing settings locally. In Safari, the most common cause of this is using "Private Browsing Mode".' +
              ' Some settings may not save or some features may not work properly for you. In this case, your coins and lives will not be saved! To be fixed soon.');
    }
}

// Initialise Phaser
var game = new Phaser.Game(800, 560, Phaser.AUTO, "game");

var encryption = require("./encryption.js");
var gameModal = require("./modal.js");
var bootState = require("./boot.js")(game);
var loadState = require("./load.js")(game);
var menuState = require("./menu.js")(game);
var playState = require("./play.js")(game);
var shopState = require("./shop.js")(game);

// Define our 'global' variable
game.global = {
    score: 0,
    modal: new gameModal(game),
    encryption: encryption,
    cache: {},
    defaults: {
        "coins": 0,
        "lives": 3
    },
    get: function(name, default) {
        if (name in defaults && default == null) default = defaults[name];
        if (name in cache) return this.cache[name];
        this.cache[name] = this.parse(this.encryption.decrypt(localStorage.getItem(name)) || default);
        return this.cache[name];
    },
    parse: function(toParse) {
        if (!isNaN(toParse)) return parseInt(toParse);
        return toParse;
    },
    set: function(name, value) {
        this.cache[name] = value;
        localStorage.setItem(name, this.encryption.encrypt(value.toString()));
    }
};
// Add all the states
game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('shop', shopState);
game.state.add('menu', menuState);
game.state.add('play', playState);
// Start the 'boot' state
game.state.start('boot');
