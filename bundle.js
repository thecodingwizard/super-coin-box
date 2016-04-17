/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

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

	var encryption = __webpack_require__(1);
	var gameModal = __webpack_require__(2);
	var bootState = __webpack_require__(3)(game);
	var loadState = __webpack_require__(4)(game);
	var menuState = __webpack_require__(5)(game);
	var playState = __webpack_require__(6)(game);
	var shopState = __webpack_require__(7)(game);

	// Define our 'global' variable
	game.global = {
	    score: 0,
	    modal: new gameModal(game),
	    encryption: encryption,
	    cache: {},
	    getCoins: function() {
	        if ("coins" in this.cache) return this.cache.coins;
	        this.cache.coins = parseInt(this.encryption.decrypt(localStorage.coins) || 0);
	        return this.cache.coins;
	    },
	    setCoins: function(value) {
	        this.cache.coins = value;
	        localStorage.coins = this.encryption.encrypt(value.toString());
	    },
	    get: function(name) {

	    },
	    set: function(name, value) {

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


/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = {
	    encrypt: function(string) {
	        var number = "0x";
	        var length = string.length;
	        for (var i = 0; i < length; i++)
	            number += string.charCodeAt(i).toString(16);
	        return number;
	    },
	    decrypt: function(number) {
	        var string = "";
	        number = number.slice(2);
	        var length = number.length;
	        for (var i = 0; i < length;) {
	            var code = number.slice(i, i += 2);
	            string += String.fromCharCode(parseInt(code, 16));
	        }
	        return string;
	    }
	};


/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = function (game) {

	    var _this = this;

	    game.modals = {};

	    /**
	     * [hideModal description]
	     * @param  {[type]} type [description]
	     * @return {[type]}      [description]
	     */
	    this.hideModal = function (type) {
	        window.console.log(type);
	        game.modals[type].visible = false;
	    };

	    return {

	        createModal: function (options) {

	            var type = options.type || ''; // must be unique
	            var includeBackground = options.includeBackground; // maybe not optional
	            var backgroundColor = options.backgroundColor || "0x000000";
	            var backgroundOpacity = options.backgroundOpacity === undefined ? 0.7 : options.backgroundOpacity;
	            var modalCloseOnInput = options.modalCloseOnInput || false;
	            var modalBackgroundCallback = options.modalBackgroundCallback || false;
	            var vCenter = options.vCenter || true;
	            var hCenter = options.hCenter || true;
	            var itemsArr = options.itemsArr || [];
	            var fixedToCamera = options.fixedToCamera || false;
	            /*var vPadding = options.vPadding || 20;*/

	            /////////////////////////////////////////////////////////////////////

	            var modal;
	            var modalGroup = game.add.group();
	            if (fixedToCamera === true) {
	                modalGroup.fixedToCamera = true;
	                modalGroup.cameraOffset.x = 0;
	                modalGroup.cameraOffset.y = 0;
	            }

	            if (includeBackground === true) {
	                modal = game.add.graphics(game.width, game.height);
	                modal.beginFill(backgroundColor, backgroundOpacity);
	                modal.x = 0;
	                modal.y = 0;

	                modal.drawRect(0, 0, game.width, game.height);

	                if (modalCloseOnInput === true) {

	                    var innerModal = game.add.sprite(0, 0);
	                    innerModal.inputEnabled = true;
	                    innerModal.width = game.width;
	                    innerModal.height = game.height;
	                    innerModal.type = type;
	                    innerModal.input.priorityID = 0;
	                    innerModal.events.onInputDown.add(function (e, pointer) {
	                        this.hideModal(e.type);
	                    }, _this, 2);

	                    modalGroup.add(innerModal);
	                } else {

	                    modalBackgroundCallback = true;
	                    //modal.inputEnabled = true;
	                    /*var innerModal = game.add.sprite(0, 0);
	                    innerModal.inputEnabled = true;
	                    innerModal.width = game.width;
	                    innerModal.height = game.height;
	                    innerModal.type = type;
	                    innerModal.input.priorityID = 2;
	                    innerModal.events.onInputDown.add(function(e){
	                        //
	                    }, _this);
	                    modalGroup.add(innerModal);*/
	                }
	            }

	            if (modalBackgroundCallback) {
	                var innerModal = game.add.sprite(0, 0);
	                innerModal.inputEnabled = true;
	                innerModal.width = game.width;
	                innerModal.height = game.height;
	                innerModal.type = type;
	                innerModal.input.priorityID = 0;

	                modalGroup.add(innerModal);
	            }

	            // add the bg
	            if (includeBackground) {
	                modalGroup.add(modal);
	            }



	            var modalLabel;
	            for (var i = 0; i < itemsArr.length; i += 1) {
	                var item = itemsArr[i];
	                var itemType = item.type || 'text';
	                var itemColor = item.color || 0x000000;
	                var itemFontfamily = item.fontFamily || 'Arial';
	                var itemFontSize = item.fontSize || 32;
	                var itemStroke = item.stroke || '0x000000';
	                var itemStrokeThickness = item.strokeThickness || 0;
	                var itemAlign = item.align || 'center';
	                var offsetX = item.offsetX || 0;
	                var offsetY = item.offsetY || 0;
	                var contentScale = item.contentScale || 1;
	                var content = item.content || "";
	                var centerX = game.width / 2;
	                var centerY = game.height / 2;
	                var callback = item.callback || false;
	                var textAlign = item.textAlign || "left";
	                var atlasParent = item.atlasParent || "";
	                var buttonHover = item.buttonHover || content;
	                var buttonActive = item.buttonActive || content;
	                var graphicColor = item.graphicColor || 0xffffff;
	                var graphicOpacity = item.graphicOpacity || 1;
	                var graphicW = item.graphicWidth || 200;
	                var graphicH = item.graphicHeight || 200;
	                var lockPosition = item.lockPosition || false;

	                modalLabel = null;

	                if (itemType === "text" || itemType === "bitmapText") {

	                    if (itemType === "text") {
	                        modalLabel = game.add.text(0, 0, content, {
	                            font: itemFontSize + 'px ' + itemFontfamily,
	                            fill: "#" + String(itemColor).replace("0x", ""),
	                            stroke: "#" + String(itemStroke).replace("0x", ""),
	                            strokeThickness: itemStrokeThickness,
	                            align: itemAlign
	                        });
	                        modalLabel.contentType = 'text';
	                        modalLabel.update();
	                        modalLabel.x = ((game.width / 2) - (modalLabel.width / 2)) + offsetX;
	                        modalLabel.y = ((game.height / 2) - (modalLabel.height / 2)) + offsetY;
	                    } else {
	                        modalLabel = game.add.bitmapText(0, 0, itemFontfamily, String(content), itemFontSize);
	                        modalLabel.contentType = 'bitmapText';
	                        modalLabel.align = textAlign;
	                        modalLabel.updateText();
	                        modalLabel.x = (centerX - (modalLabel.width / 2)) + offsetX;
	                        modalLabel.y = (centerY - (modalLabel.height / 2)) + offsetY;
	                    }

	                } else if (itemType === "image") {
	                    //content = item.imageKey || "";
	                    modalLabel = game.add.image(0, 0, content);
	                    modalLabel.scale.setTo(contentScale, contentScale);
	                    modalLabel.contentType = 'image';
	                    modalLabel.x = (centerX - ((modalLabel.width) / 2)) + offsetX;
	                    modalLabel.y = (centerY - ((modalLabel.height) / 2)) + offsetY;
	                }
	                else if (itemType === "sprite") {
	                    modalLabel = game.add.sprite(0, 0, atlasParent, content);
	                    modalLabel.scale.setTo(contentScale, contentScale);
	                    modalLabel.contentType = 'sprite';
	                    modalLabel.x = (centerX - ((modalLabel.width) / 2)) + offsetX;
	                    modalLabel.y = (centerY - ((modalLabel.height) / 2)) + offsetY;
	                }
	                else if(itemType === "button") {
	                    modalLabel = game.add.button(0, 0, atlasParent, callback, this, buttonHover, content, buttonActive, content);
	                    modalLabel.scale.setTo(contentScale, contentScale);
	                    modalLabel.contentType = 'button';
	                    modalLabel.x = (centerX - ((modalLabel.width) / 2)) + offsetX;
	                    modalLabel.y = (centerY - ((modalLabel.height) / 2)) + offsetY;
	                }
	                else if(itemType === "graphics") {
	                    modalLabel = game.add.graphics(graphicW, graphicH);
	                    modalLabel.beginFill(graphicColor, graphicOpacity);

	                    modalLabel.drawRect(0, 0, graphicW, graphicH);
	                    modalLabel.endFill();
	                    modalLabel.x = (centerX - ((modalLabel.width) / 2)) + offsetX;
	                    modalLabel.y = (centerY - ((modalLabel.height) / 2)) + offsetY;
	                }

	                modalLabel["_offsetX"] = 0;
	                modalLabel["_offsetY"] = 0;
	                modalLabel["lockPosition"] = lockPosition;
	                modalLabel._offsetX = offsetX;
	                modalLabel._offsetY = offsetY;


	                if (callback !== false && itemType !== "button") {
	                    modalLabel.inputEnabled = true;
	                    modalLabel.pixelPerfectClick = true;
	                    modalLabel.priorityID = 10;
	                    modalLabel.events.onInputDown.add(callback, modalLabel);
	                }

	                if (itemType !== "bitmapText" && itemType !== "graphics") {
	                    modalLabel.bringToTop();
	                    modalGroup.add(modalLabel);
	                    modalLabel.bringToTop();
	                    modalGroup.bringToTop(modalLabel);
	                } else {
	                    modalGroup.add(modalLabel);
	                    modalGroup.bringToTop(modalLabel);
	                }
	            }

	            modalGroup.visible = false;
	            game.modals[type] = modalGroup;

	        },
	        updateModalValue: function (value, type, index, id) {
	            var item;
	            if (index !== undefined && index !== null) {
	                item = game.modals[type].getChildAt(index);
	            } else if (id !== undefined && id !== null) {

	            }

	            if (item.contentType === "text") {
	                item.text = value;
	                item.update();
	                if (item.lockPosition === true){

	                }
	                else {
	                    item.x = ((game.width / 2) - (item.width / 2)) + item._offsetX;
	                    item.y = ((game.height / 2) - (item.height / 2)) + item._offsetY;
	                }
	            } else if (item.contentType === "bitmapText") {
	                item.text = value;
	                item.updateText();
	                if(item.lockPosition === true) {

	                }
	                else {
	                    item.x = ((game.width / 2) - (item.width / 2)) + item._offsetX;
	                    item.y = ((game.height / 2) - (item.height / 2)) + item._offsetY;
	                }
	            } else if (item.contentType === "image") {
	                item.loadTexture(value);
	            }

	        },
	        getModalItem: function (type, index) {
	            return game.modals[type].getChildAt(index);
	        },
	        showModal: function (type) {
	            game.world.bringToTop(game.modals[type]);
	            game.modals[type].visible = true;
	            // you can add animation here
	        },
	        hideModal: function (type) {
	            game.modals[type].visible = false;
	            // you can add animation here
	        },
	        destroyModal: function (type) {
	            game.modals[type].destroy();
	            delete game.modals[type];
	        }
	    };
	};


/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = function(game) {
	    return {
	        preload: function () {
	            if (!game.device.desktop) {
	                // Set the type of scaling to 'show all'
	                game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
	                // Add a blue color to the page, to hide the white borders we might have
	                document.body.style.backgroundColor = '#3498db';
	                // Set the min and max width/height of the game
	                // game.scale.minWidth = 250;
	                // game.scale.minHeight = 170;
	                // game.scale.maxWidth = 1000;
	                // game.scale.maxHeight = 680;
	                // Center the game on the screen
	                game.scale.pageAlignHorizontally = true;
	                game.scale.pageAlignVertically = true;
	            }

	            game.load.image('progressBar', 'assets/progressBar.png');
	        },
	        create: function() {
	            // Set some game settings
	            game.stage.backgroundColor = '#3498db';
	            game.physics.startSystem(Phaser.Physics.ARCADE);
	            // Start the load state
	            game.state.start('load');
	        }
	    };
	};


/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = function(game) {
	    return {
	        preload: function () {
	            // Add a 'loading...' label on the screen
	            var loadingLabel = game.add.text(game.world.centerX, 150, 'loading...',
	            { font: '30px Arial', fill: '#ffffff' });
	            loadingLabel.anchor.setTo(0.5, 0.5);
	            // Display the progress bar
	            var progressBar = game.add.sprite(game.world.centerX, 200, 'progressBar');
	            progressBar.anchor.setTo(0.5, 0.5);
	            game.load.setPreloadSprite(progressBar);
	            // Load all our assets
	            game.load.spritesheet('player', 'assets/player2.png', 20, 20);
	            game.load.image('enemy', 'assets/enemy.png');
	            game.load.image('coin', 'assets/coin.png');
	            game.load.image('background', 'assets/background.png');
	            game.load.audio('jump', ['assets/jump.ogg', 'assets/jump.mp3']);
	            game.load.audio('coin', ['assets/coin.ogg', 'assets/coin.mp3']);
	            game.load.audio('dead', ['assets/dead.ogg', 'assets/dead.mp3']);
	            game.load.audio('music', ['assets/music_happy.mp3']);
	            game.load.image('pixel', 'assets/pixel.png');
	            game.load.spritesheet('mute', 'assets/muteButton.png', 28, 22);
	            game.load.image('tileset', 'assets/tileset.png');
	            game.load.tilemap('map', 'assets/map.json', null, Phaser.Tilemap.TILED_JSON);
	            game.load.image('jumpButton', 'assets/jumpButton.png');
	            game.load.image('rightButton', 'assets/rightButton.png');
	            game.load.image('leftButton', 'assets/leftButton.png');
	            game.load.image('backButton', 'assets/back.png');
	            game.load.image('moreLives', 'assets/more-lives.png');
	        },
	        create: function() {
	            game.state.start('menu');
	        }
	    };
	};


/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = function(game) {
	    return {
	        checkDecoded: true,
	        create: function() {
	            var background = game.add.sprite(0, 0, 'background');
	            background.inputEnabled = true;
	            var nameLabel = game.add.text(game.world.centerX, -100, 'Super Coin Box', { font: '100px Geo', fill: '#ffffff' });
	            nameLabel.anchor.setTo(0.5, 0.5);
	            var scoreLabel = game.add.text(game.world.centerX, game.world.centerY,
	                'score: ' + game.global.score,
	                { font: '40px Arial', fill: '#ffffff' });
	            scoreLabel.anchor.setTo(0.5, 0.5);
	            if (game.device.desktop) {
	                var text = 'press the up arrow key to start';
	            } else {
	                var text = 'touch the screen to start';
	            }
	            var startLabel = game.add.text(game.world.centerX, game.world.height-120,
	                text,
	                { font: '40px Arial', fill: '#ffffff' });
	            startLabel.anchor.setTo(0.5, 0.5);
	            startLabel.angle = 2;
	            var upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
	            upKey.onDown.addOnce(this.start, this);

	            if (this.checkDecoded) {
	                this.musicLoadingLabel = game.add.text(game.world.centerX, game.world.height - 18, "Loading music...",
	                    { font: "14px Arial", fill: "#ffffff" });
	                this.musicLoadingLabel.anchor.setTo(0.5, 0.5);
	            }

	            game.add.tween(nameLabel).to({y: 80}, 700).easing(Phaser.Easing.Bounce.Out).start();
	            game.add.tween(startLabel).to({angle: -2}, 500).to({angle: 2}, 500).loop().start();

	            this.music = game.add.audio('music');

	            this.muteButton = game.add.button(40, 40, 'mute', this.toggleSound, this);
	            this.muteButton.input.useHandCursor = true;

	            if (game.sound.mute) {
	                this.muteButton.frame = 1;
	            }

	            var shopText = game.device.desktop ? "Press the Down Arrow key to shop" : "Tap to shop";
	            this.shopButton = game.add.text(game.world.centerX, game.world.height - 200, shopText, { font: "36px Arial", fill: "#ffffff" });
	            this.shopButton.anchor.setTo(0.5, 0.5);
	            this.shopButton.inputEnabled = true;
	            this.shopButton.events.onInputDown.addOnce(this.shop, this);
	            var downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
	            downKey.onDown.addOnce(this.shop, this);

	            background.events.onInputDown.add(this.start, this);
	        },
	        shop: function() {
	            game.state.start("shop");
	        },
	        toggleSound: function() {
	            game.sound.mute = ! game.sound.mute;
	            this.muteButton.frame = game.sound.mute ? 1 : 0;
	        },
	        start: function() {
	            game.state.start('play');
	        },
	        update: function() {
	            if (this.checkDecoded && !this.music.isDecoding) {
	                game.world.remove(this.musicLoadingLabel);
	                this.checkDecoded = false;
	            }
	        }
	    };
	};


/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = function(game) {
	    return playState = {
	        level: 1,
	        maxLevel: 1,
	        coinPositions: [
	            {x: 120, y: 135}, {x: 680, y: 135},
	            {x: 120, y: 295}, {x: 680, y: 295},
	            {x: 120, y: 455}, {x: 680, y: 455}
	        ],
	        typed: "",
	        lives: 3,
	        energy: 100,
	        maxEnergy: 100,
	        currentFadeOutEnergyLabelTween: null,
	        prevEnergyUpdateTime: 0,
	        create: function() {
	            game.time.advancedTiming = true;
	            game.renderer.renderSession.roundPixels = true;
	            this.level = 1;
	            this.lives = window.localStorage.lives || 3;
	            game.global.score = 0;
	            this.maxEnergy = 100; // todo replace with localstorage
	            this.energy = this.maxEnergy;
	            this.currentFadeOutEnergyLabelTween = null;

	            this.cursor = game.input.keyboard.createCursorKeys();

	            this.player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');
	            this.player.anchor.setTo(0.5, 0.5);
	            game.physics.arcade.enable(this.player);
	            this.player.body.gravity.y = 500;
	            this.player.animations.add('right', [1, 2], 8, true);
	            this.player.animations.add('left', [3, 4], 8, true);

	            this.enemies = game.add.group();
	            this.enemies.enableBody = true;
	            this.enemies.createMultiple(30, 'enemy');

	            this.bullets = game.add.group();
	            this.bullets.enableBody = true;
	            this.bullets.createMultiple(20, 'pixel');

	            this.coin = game.add.sprite(0, 0, 'coin');
	            this.coin.anchor.setTo(0.5, 0.5);
	            this.updateCoinPosition();
	            game.physics.arcade.enable(this.coin);

	            this.scoreLabel = game.add.text(30, 30, 'Score: 0', { font: '24px Arial', fill: '#ffffff' });
	            game.global.score = 0;

	            this.levelLabel = game.add.text(30, 60, "Level " + this.level, { font: '24px Arial', fill: '#ffffff' });
	            this.livesLabel = game.add.text(30, 90, "Lives: " + this.lives, { font: '24px Arial', fill: '#ffffff' });

	            this.coinsLabel = game.add.text(30, 120, "Coins: " + game.global.getCoins(), { font: '24px Arial', fill: '#ffffff' });

	            this.jumpSound = game.add.audio('jump');
	            this.coinSound = game.add.audio('coin');
	            this.deadSound = game.add.audio('dead');

	            this.emitter = game.add.emitter(0, 0);
	            this.emitter.makeParticles('pixel', 0, 150, true);
	            this.emitter.setYSpeed(-150, 150);
	            this.emitter.setXSpeed(-150, 150);
	            this.emitter.gravity = 0;

	            this.music = game.add.audio('music');
	            this.music.loop = true;
	            this.music.volume = 0.5;
	            this.music.play();

	            this.createWorld();
	            this.maxLevel = this.map.layers.length;

	            this.nextEnemy = 0;

	            game.input.keyboard.addKeyCapture([Phaser.Keyboard.UP, Phaser.Keyboard.DOWN, Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT, Phaser.Keyboard.SPACEBAR]);

	            this.wasd = {
	                up: game.input.keyboard.addKey(Phaser.Keyboard.W),
	                left: game.input.keyboard.addKey(Phaser.Keyboard.A),
	                right: game.input.keyboard.addKey(Phaser.Keyboard.D)
	            };

	            if (!game.device.desktop) {
	                // Display the mobile inputs
	                this.addMobileInputs();
	            }

	            var fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	            fireButton.onDown.add(this.fire, this);
	            game.input.keyboard.onUpCallback = this.checkCheats;

	            this.muteButton = game.add.button(game.world.width - 40, 30, 'mute', this.toggleSound, this);
	            this.muteButton.input.useHandCursor = true;
	            this.muteButton.anchor.setTo(1, 0);
	            if (game.sound.mute) {
	                this.muteButton.frame = 1;
	            }

	            this.energyLabel = game.add.text(game.world.width - 40, 60, "Energy: 100", { font: "24px Arial", fill: "#ffffff" });
	            this.updateEnergy();
	            this.energyLabel.anchor.setTo(1, 0);

	            this.notEnoughEnergyLabel = game.add.text(game.world.centerX, game.world.height - 34, "Not Enough Energy!", { font: "24px Arial", fill: "#ffffff" });
	            this.notEnoughEnergyLabel.anchor.setTo(0.5, 0.5);
	            this.notEnoughEnergyLabel.alpha = 0;
	        },
	        incrementEnergy: function() {
	            if (this.energy >= this.maxEnergy) return;
	            this.energy+=5;
	            this.updateEnergy();
	        },
	        fire: function() {
	            if (this.energy >= 20) {
	                this.prevEnergyUpdateTime = game.time.now;
	                this.energy -= 20;
	                if (Math.abs(this.player.body.velocity.x) > this.player.body.velocity.y) {
	                    this.emitter.x = this.player.x + this.player.body.velocity.x/2;
	                    this.emitter.y = this.player.y;
	                } else if (this.player.body.velocity.x == 0 && this.player.body.velocity.y == 0) {
	                    // up
	                    this.emitter.x = this.player.x;
	                    this.emitter.y = this.player.y + this.player.body.velocity.y/2;
	                } else {
	                    // stationary
	                    this.emitter.x = this.player.x;
	                    this.emitter.y = this.player.y;
	                }
	                this.emitter.start(true, 600, null, 30);

	                for (var i = 0; i < 4; i++) {
	                    var bullet = this.bullets.getFirstDead();
	                    bullet.reset(this.player.x, this.player.y);
	                    bullet.lifespan = 1000;
	                    switch (i) {
	                        case 0:
	                            bullet.body.velocity.y = 400;
	                            break;
	                        case 1:
	                            bullet.body.velocity.x = 400;
	                            break;
	                        case 2:
	                            bullet.body.velocity.x = -400;
	                            break;
	                        case 3:
	                            bullet.body.velocity.y = -400;
	                            break;
	                    }
	                }

	                this.updateEnergy();
	            } else {
	                this.notEnoughEnergy();
	            }
	        },
	        notEnoughEnergy: function() {
	            if (this.currentFadeOutEnergyLabelTween != null) this.currentFadeOutEnergyLabelTween.stop();
	            this.notEnoughEnergyLabel.alpha = 1;
	            game.time.events.add(Phaser.Timer.SECOND * 2, this.enoughEnergy, this);
	        },
	        enoughEnergy: function() {
	            this.currentFadeOutEnergyLabelTween = game.add.tween(this.notEnoughEnergyLabel).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true);
	        },
	        updateEnergy: function() {
	            this.energyLabel.setText("Energy: " + this.energy);
	        },
	        toggleSound: function() {
	            game.sound.mute = ! game.sound.mute;
	            this.muteButton.frame = game.sound.mute ? 1 : 0;
	        },
	        checkCheats: function(key) {
	            playState.typed += String.fromCharCode(key.keyCode);
	            playState.typed = playState.typed.substring(playState.typed.length - 4, playState.typed.length);
	            if (playState.typed.indexOf("HELP") != -1) {
	                playState.enemies.forEachAlive(function(enemy) { enemy.kill(); });
	            } else if (playState.typed.indexOf("MORE") != -1) {
	                game.global.score += 50;
	                playState.checkLevelUp();
	                playState.scoreLabel.setText("Score: " + game.global.score);
	            } else if (playState.typed.indexOf("LIVE") != -1) {
	                playState.lives++;
	                playState.livesLabel.setText("Lives: " + playState.lives);
	            }
	        },
	        checkLevelUp: function() {
	            if (game.global.score % 50 == 0) {
	                this.levelUp();
	            }
	        },
	        addMobileInputs: function() {
	            // Add the jump button
	            this.jumpButton = game.add.sprite(650, 400, 'jumpButton');
	            this.jumpButton.inputEnabled = true;
	            this.jumpButton.alpha = 0.5;

	            this.moveLeft = false;
	            this.moveRight = false;

	            // Add the move left button
	            this.leftButton = game.add.sprite(50, 400, 'leftButton');
	            this.leftButton.inputEnabled = true;
	            this.leftButton.events.onInputOver.add(function(){this.moveLeft=true;}, this);
	            this.leftButton.events.onInputOut.add(function(){this.moveLeft=false;}, this);
	            this.leftButton.events.onInputDown.add(function(){this.moveLeft=true;}, this);
	            this.leftButton.events.onInputUp.add(function(){this.moveLeft=false;}, this);
	            this.leftButton.alpha = 0.5;
	            // Add the move right button
	            this.rightButton = game.add.sprite(170, 400, 'rightButton');
	            this.rightButton.inputEnabled = true;
	            this.rightButton.events.onInputOver.add(function(){this.moveRight=true;}, this);
	            this.rightButton.events.onInputOut.add(function(){this.moveRight=false;}, this);
	            this.rightButton.events.onInputDown.add(function(){this.moveRight=true;}, this);
	            this.rightButton.events.onInputUp.add(function(){this.moveRight=false;}, this);
	            this.rightButton.alpha = 0.5;

	            this.jumpButton.events.onInputDown.add(this.jumpPlayer, this);
	        },
	        createWorld: function() {
	            this.map = game.add.tilemap('map');
	            this.map.addTilesetImage('tileset');
	            this.layer = this.map.createLayer('Level ' + this.level);
	            this.setupMap();
	        },
	        levelUp: function() {
	            this.lives++;
	            this.livesLabel.setText("Lives: " + this.lives);
	            if (this.level >= this.maxLevel) return;
	            this.level++;
	            this.layer.destroy();
	            this.enemies.forEachAlive(function(enemy) { enemy.kill() });
	            this.player.x = game.world.centerX;
	            this.player.y = game.world.centerY;
	            this.layer = this.map.createLayer('Level ' + this.level);
	            this.setupMap();
	            this.levelLabel.setText("Level " + this.level);
	        },
	        setupMap: function() {
	            this.layer.resizeWorld();
	            this.map.setCollision(1, true, this.layer);
	            this.map.setTileIndexCallback(2, this.collidedWithRed, this, this.layer);
	        },
	        collidedWithRed: function(sprite) {
	            if (sprite == this.player) this.playerDie();
	        },
	        addEnemy: function() {
	            var enemy = this.enemies.getFirstDead();
	            if (!enemy) return;
	            enemy.anchor.setTo(0.5, 1);
	            enemy.reset(game.world.centerX, 0);
	            if (Phaser.Utils.chanceRoll(Math.min(10 + game.global.score/2.5, 50))) {
	                // spawn hard enemy!
	                enemy.scale.setTo(1.3, 1.3);
	                enemy.body.gravity.y = 700;
	                enemy.body.velocity.x = 150 * (Math.random() > 0.5 == 1 ? -1 : 1);
	            } else {
	                enemy.scale.setTo(1, 1);
	                enemy.body.gravity.y = 500;
	                enemy.body.velocity.x = 100 * (Math.random() > 0.5 == 1 ? -1 : 1);
	            }
	            enemy.body.bounce.x = 1;
	            enemy.checkWorldBounds = true;
	            enemy.outOfBoundsKill = true;
	        },
	        update: function() {
	            if (window.location.href.indexOf("localhost") != -1) game.debug.text(game.time.fps, 2, 14, "#00ff00");
	            game.physics.arcade.collide(this.player, this.layer);
	            game.physics.arcade.collide(this.enemies, this.layer);
	            game.physics.arcade.overlap(this.player, this.coin, this.takeCoin, null, this);
	            game.physics.arcade.overlap(this.player, this.enemies, this.playerDie, null, this);
	            game.physics.arcade.collide(this.enemies, this.emitter, this.enemyDie, null, this);
	            game.physics.arcade.collide(this.enemies, this.bullets, this.enemyDie, null, this);
	            this.movePlayer();
	            if (!this.player.inWorld) {
	                this.playerDie();
	            }

	            if (this.nextEnemy < game.time.now) {
	                var start = 4000, end = 1000, score = 100;
	                var delay = Math.max(start - (start-end)*game.global.score/score, end);
	                if (this.level == 3) {
	                    delay = 500;
	                }
	                this.addEnemy();
	                this.nextEnemy = game.time.now + delay;
	            }

	            if (game.time.now - this.prevEnergyUpdateTime >= Phaser.Timer.SECOND*5/2) {
	                this.incrementEnergy();
	                this.prevEnergyUpdateTime = game.time.now;
	            }
	        },
	        enemyDie: function(enemy) {
	            enemy.kill();
	        },
	        movePlayer: function() {
	            if (this.cursor.left.isDown || this.wasd.left.isDown || this.moveLeft) {
	                this.player.body.velocity.x = -200;
	                this.player.animations.play('left');
	            } else if (this.cursor.right.isDown || this.wasd.right.isDown || this.moveRight) {
	                this.player.body.velocity.x = 200;
	                this.player.animations.play('right');
	            } else {
	                this.player.body.velocity.x = 0;
	                this.player.frame = 0;
	            }
	            if (this.cursor.up.isDown || this.wasd.up.isDown) {
	                this.jumpPlayer();
	            }
	        },
	        takeCoin: function(player, coin) {
	            game.global.score += 5;
	            game.global.setCoins(game.global.getCoins()+1);
	            this.scoreLabel.text = 'Score: ' + game.global.score;
	            this.coinsLabel.text = "Coins: " + game.global.getCoins();
	            this.coinSound.play();
	            this.updateCoinPosition();

	            if (game.global.score % 50 == 0) {
	                this.levelUp();
	            }

	            this.coin.scale.setTo(0, 0);
	            game.add.tween(this.coin.scale).to({x: 1, y: 1}, 300).start();

	            game.add.tween(this.player.scale).to({x: 1.3, y: 1.3}, 50).to({x: 1, y: 1}, 150).start();
	        },
	        updateCoinPosition: function() {
	            var spliced;
	            for (var i = 0; i < this.coinPositions.length; i++) {
	                if (this.coinPositions[i].x === this.coin.x && this.coinPositions[i].y == this.coin.y) {
	                    var spliced = this.coinPositions.splice(i, 1);
	                }
	            }
	            var newPosition = this.coinPositions[game.rnd.integerInRange(0, this.coinPositions.length-1)];
	            if (spliced != null) this.coinPositions.push(spliced[0]);
	            this.coin.reset(newPosition.x, newPosition.y);
	        },
	        playerDie: function() {
	            if (!this.player.alive) {
	                return;
	            }
	            this.lives--;
	            this.enemies.forEachAlive(function(enemy) { enemy.kill(); });
	            this.livesLabel.setText("Lives: " + this.lives);
	            this.player.kill();
	            this.emitter.x = this.player.x;
	            this.emitter.y = this.player.y;
	            this.emitter.start(true, 600, null, 15);
	            this.deadSound.play();
	            if (this.lives < 1) {
	                this.music.stop();
	                game.time.events.add(1000, this.startMenu, this);
	            } else {
	                game.time.events.add(1000, function() {
	                    this.player.reset(game.world.centerX, game.world.centerY);
	                }, this);
	            }
	        },
	        jumpPlayer: function() {
	            // If the player is touching the ground
	            if (this.player.body.onFloor()) {
	                // Jump with sound
	                this.player.body.velocity.y = -320;
	                this.jumpSound.play();
	            }
	        },
	        startMenu: function() {
	            game.state.start('menu');
	        }
	    };
	};


/***/ },
/* 7 */
/***/ function(module, exports) {

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

	            this.coinsLabel = game.add.text(game.world.width - 50, 50, "Coins: " + game.global.getCoins(), { font: "36px Arial", fill: "#ffffff" });
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
	            return ((window.localStorage.lives || 3) - 3)*20 + 10;
	        },
	        moreLives: function() {
	            if (game.global.getCoins() >= this.getMoreLivesCost()) {
	                this.updateCoins(game.global.getCoins() - this.getMoreLivesCost());
	                if (window.localStorage.lives) {
	                    window.localStorage.lives++;
	                } else {
	                    window.localStorage.lives = 4;
	                }
	                this.setMoreLivesText();
	            } else {
	                game.global.modal.showModal("notEnoughMoney");
	            }
	        },
	        updateCoins: function(coins) {
	            game.global.setCoins(coins);
	            this.coinsLabel.setText("Coins: " + game.global.getCoins());
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


/***/ }
/******/ ]);