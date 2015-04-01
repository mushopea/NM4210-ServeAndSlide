Slider.Game = function(game) {
    // = = = = = = = = = = = = = = = = =
    // Slider.Game local variables
    // = = = = = = = = = = = = = = = = =
    console.log("Initializing local game variables.");

    // item values
    this.itemName = ["Tea Cup", "Wine Glass", "Milk Bottle", "Beer Bottle", "Water Jug"];
    this.itemWeight = [100, 200, 300, 500, 700];
    this.itemImage = ['teaCup', 'wineGlass', 'milkBottle', 'beerBottle', 'waterJug'];
    this.itemTile = ['teatile', 'winetile', 'milktile', 'beertile', 'watertile'];
    this.itemMassDescription = ['tiny', 'small', 'medium', 'large', 'very large'];
    this.itemWeightDescription = ["very light", "light", "of normal weight", "heavy", "very heavy"];
    this.itemForceDescription = ["very little", "rather little", "a fair amount of", "quite strong", "very strong"];
    this.itemShortDescription = ["Very light", "Light", "Normal weight", "Heavy", "Very heavy"];

    // surface values
    this.surfaceName = ["wood", "carpet", "ice"];
    this.surfaceNameCapital = ["Wood", "Carpet", "Ice"];
    this.surfaceTile = ['woodtile', 'carpettile', 'icetile'];
    this.surfaceFriction = [0.3, 0.6, 0.05]; // source: http://www.engineeringtoolbox.com/friction-coefficients-d_778.html
    this.surfaceFrictionText = ["Normal", "High", "Low"];
    this.surfaceFrictionEase = ["normally", "with difficulty", "easily"];
    this.surfaceFrictionForce = ["normal", "larger", "smaller"];
    this.surfaceFrictionMultiplier = [1, 0.75, 1.5];

    // game variables
    this.xmlHttp = null;
    this.frameCount = 0;
    this.gameStates = ["waitingForNextPlayer", "waitingToPushObject", "endGame"];

    // game assets
    this.player = null;

    // sensor values
    this.minSensorValue = 3;
    this.maxSensorValue = 20;
    this.currMaxValue = 0;
}

Slider.Game.prototype.create = function() {
    // = = = = = = = = = = = = = = = = =
    // Game world
    // = = = = = = = = = = = = = = = = =

    // initialize curr state maintenance vars
    this.player = null;
    this.showedScore = false;
    this.currentRound = 1;
    this.currentPlayer = 1;
    this.currentItem = Math.floor(Math.random() * this.itemName.length);
    this.currentSurface = Math.floor(Math.random() * this.surfaceName.length);
    this.currentGameState = this.gameStates[1];
    this.currentRoundScore = 0;
    this.currentScores = [];
    for (var m = 0; m < Slider.numberOfPlayers; m++) {
        this.currentScores.push(0);
    }

    this.initPhysics();
    this.initUI();
    this.initSounds();
    // this.initBGM();
}

// = = = = = = = = = = = = = = = = =
// Initializations
// = = = = = = = = = = = = = = = = =

Slider.Game.prototype.initPhysics = function() {
    // We're going to be using physics, so enable the Arcade Physics system
    this.physics.startSystem(Phaser.Physics.ARCADE);
}

Slider.Game.prototype.initBGM = function() {
    this.bgm = game.add.audio('bgm');
    this.bgm.onDecoded.add(function() { this.bgm.fadeIn(5000); }, this);
    this.bgm.play();
}

Slider.Game.prototype.initSounds = function() {
    this.breakSound = game.add.audio('break');
    this.manyPointsSound = game.add.audio('manypoints');
    this.manyPointsSound.volume += 1.5;
    this.pointsSound = game.add.audio('points');
    this.slideSound = game.add.audio('slide2');
}

Slider.Game.prototype.initUI = function() {
    this.initRoom();
    this.initCat();
    this.initBoundarySprite();
    this.updateTable();
    this.updatePlayer();
    this.initQuitBtn();
    this.initScoreboard();
    this.initSpeechBubble();
    this.updateSpeech();
}

Slider.Game.prototype.initRoom = function() {
    // positioning variables
    var canvasHeight = Slider.GAME_HEIGHT;
    var canvasWidth = Slider.GAME_WIDTH;

    // A simple background for our game
    this.room = this.add.sprite(0, 0, 'room');
    this.room.height = canvasHeight;
    this.room.width = canvasWidth;
}

Slider.Game.prototype.initCat = function() {
    // positioning variables
    var canvasWidth = Slider.GAME_WIDTH;

    // Cat sprite
    this.cat = this.add.sprite(0, 0, 'cat');
    this.cat.x = canvasWidth/2 - this.cat.width/2;
    this.catBottom = this.cat.y + this.cat.height;

    // Cat animations
    this.cat.animations.add('idle', [0,0,0,1,1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,2,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], 30, true);
    this.cat.animations.add('hit', [3,4], 6, true);
    this.cat.animations.add('happy', [5,6], 2, true);
    this.cat.animations.play("idle");
}

Slider.Game.prototype.initBoundarySprite = function() {
    if (this.boundarySprite) {
        this.boundarySprite.destroy();
    }

    // Player sprite properties
    this.boundarySprite = this.add.sprite(0, 0, 'round');
    this.boundarySprite.x = game.world.centerX;
    this.boundarySprite.y = this.cat.y + 120;
    this.boundarySprite.alpha = 0;
    this.boundarySprite.anchor.set(0.5);
    this.physics.enable(this.boundarySprite, Phaser.Physics.ARCADE);
}

Slider.Game.prototype.initScoreboard = function() {
    //  Score board
    this.scoreboardHeight = 180;
    this.scoreboardWidth = 425;
    for (var i = 0; i < Slider.numberOfPlayers; i++) {
        this.scoreboardHeight += 90;
    }
    this.scoreboard = this.add.graphics(0, 0);
    this.scoreboard.beginFill(0xFFFFFF, 1);
    this.scoreboard.bounds = new PIXI.Rectangle(0, 0, this.scoreboardWidth, this.scoreboardHeight);
    this.scoreboard.drawRect(0, 0, this.scoreboardWidth, this.scoreboardHeight);
    this.scoreboard.alpha = 0.6;

    // Score board game round info
    this.updateScoreboard();
}

Slider.Game.prototype.initQuitBtn = function() {
    // positioning variables
    var canvasHeight = Slider.GAME_HEIGHT;
    var canvasWidth = Slider.GAME_WIDTH;

    // Quit button
    this.quitButton = this.add.button(800, 600, 'quit', this.onClickQuitButton, this, 0, 0, 1);
    this.quitButton.height = this.quitButton.height * 2;
    this.quitButton.width = this.quitButton.width * 2;
    this.quitButton.x = canvasWidth - this.quitButton.width-5;
    this.quitButton.y = canvasHeight - this.quitButton.height-5;
    this.game.input.keyboard.addKey(Phaser.Keyboard.ESC).onDown.add(function () { this.onClickQuitButton(); }, this); //esc to quit
}

Slider.Game.prototype.initSpeechBubble = function() {
    // speech bubble
    this.speechbubble = this.add.sprite(this.cat.x + this.cat.width + 50, 50, 'speechbubble');
}


// = = = = = = = = = = = = = = = = =
// Events
// = = = = = = = = = = = = = = = = =

Slider.Game.prototype.shutdown = function() {
    console.log("Game shutdown commencing. Destroying assets.");
    if (this.room) { this.room.destroy(); }
    if (this.cat) { this.cat.destroy(); }
    if (this.table) { this.table.destroy(); }
    if (this.player) { this.player.destroy(); }
    if (this.scoreboard) { this.scoreboard.destroy(); }
    if (this.speechbubble) { this.speechbubble.destroy(); }
    if (this.quitButton) { this.quitButton.destroy(); }
}

Slider.Game.prototype.onClickQuitButton = function() {
    // to do: open a ARE YOU FUCKING SURE window.
    // Yes = go back to mainmenu.js. No = continue.
    console.log("Quitting game");
    this.game.time.events.remove(this.timer);
    this.state.start('QuitGame');
}

Slider.Game.prototype.endTheGame = function() {
    currentGameState = "endGame";

    // decide who is the winner with max score.
    var winner = 0;
    for (var i = 0; i < this.currentScores.length; i++) {
        if (this.currentScores[winner] < this.currentScores[i]) {
            winner = i;
        }
    }

    // store the scores globally
    Slider.winner = winner + 1;
    Slider.scores = this.currentScores;

    // switch state
    console.log("Ending game");
    this.game.time.events.remove(this.timer);
    this.state.start('GameOver');
}

// = = = = = = = = = = = = = = = = =
// Updates
// = = = = = = = = = = = = = = = = =

// update player sprite
Slider.Game.prototype.updatePlayer = function() {
    if (this.player) {
        this.player.destroy();
    }

    // Player sprite properties
    this.player = this.add.sprite(0, 0, this.itemImage[this.currentItem]);
    this.player.x = Slider.GAME_WIDTH/2 - this.player.width/2;
    this.player.y = Slider.GAME_HEIGHT - 20 - this.player.height;
    this.physics.enable(this.player, Phaser.Physics.ARCADE);
    this.player.body.drag.set(100);

    if (this.currentRound === 1) {
        this.gestureguide = this.add.sprite(this.player.x + this.player.width + 30, Slider.GAME_HEIGHT - this.player.height - 10 - 200, 'gestureguide');
        this.gestureguide.animations.add('ani', [0,1], 0.75, true);
        this.gestureguide.animations.play("ani");
    }
}

// update table
Slider.Game.prototype.updateTable = function() {
    if (this.table) { this.table.destroy(); }
    if (this.gestureguide) { this.gestureguide.destroy(); }

    // positioning variables
    var canvasHeight = Slider.GAME_HEIGHT;
    var canvasWidth = Slider.GAME_WIDTH;

    // Table
    this.table = this.add.sprite(0, 0, this.surfaceName[this.currentSurface]);
    this.table.height = canvasHeight;
    this.table.width = canvasWidth;
}

// update scoreboard
Slider.Game.prototype.updateScoreboard = function() {
    if (this.roundText) { this.roundText.destroy(); }
    if (this.roundCatGroup) { this.roundCatGroup.destroy(); }
    if (this.playerTextGroup) { this.playerTextGroup.destroy(); }

    // layout values
    var padding = 30;
    var topPadding = 30;
    var roundPadding = 75;
    var playerY = 210;
    var playerIncrement = 80;
    var playerScoreMargin = 285;

    // "Round 1/5"
    this.roundText = this.add.text(padding, topPadding, "Round " + this.currentRound + " / " + Slider.NUMBER_OF_ROUNDS, {font: "50px Fredoka", align: "center", fill:'#000'});

    // kitty round indicators :D
    this.roundCatGroup = this.add.group();

    for (var i = 0; i < this.currentRound; i++) {
        this.roundCatGroup.create(padding + i*roundPadding, this.roundText.x + this.roundText.height + padding/2, 'roundfilled');
    }

    for (var j = 0; j < Slider.NUMBER_OF_ROUNDS - this.currentRound; j++) {
        this.roundCatGroup.create(padding + j*roundPadding + this.currentRound*roundPadding, this.roundText.x + this.roundText.height + padding/2, 'round');
    }

    // Player and their score
    this.playerTextGroup = this.add.group();
    for (var n = 0; n < Slider.numberOfPlayers; n++) {
        var playerNo = n + 1;

        if (playerNo == this.currentPlayer) {
            txt = this.add.text(padding, playerY + n*playerIncrement, "Player " + playerNo, {font: "40px Fredoka", align: "center", fill:'#5BB3E0'});
        } else {
            txt = this.add.text(padding, playerY + n*playerIncrement, "Player " + playerNo, {font: "40px Fredoka", align: "center", fill:'#000'});
        }

        this.playerTextGroup.add(txt);
    }
    for (var m = 0; m < Slider.numberOfPlayers; m++) {
        var score = this.currentScores[m].toString();
        var playerNo = m + 1;

        if (playerNo == this.currentPlayer) {
            txt = this.add.text(padding + playerScoreMargin, playerY + m*playerIncrement, score, {font: "40px Fredoka", align: "center", fill:'#5BB3E0'});
        } else {
            txt = this.add.text(padding + playerScoreMargin, playerY + m*playerIncrement, score, {font: "40px Fredoka", align: "center", fill:'#000'});
        }

        this.playerTextGroup.add(txt);
    }
}

// update cat's speech
Slider.Game.prototype.updateSpeech = function() {
    var padding = 30;
    var xpos = padding + this.speechbubble.x + 200;
    var speechspace = 345;
    var tilesize = 90;

    if (this.speechgroup) { this.speechgroup.destroy(); }
    this.speechgroup = this.add.group();

    txt = this.add.text(xpos, this.speechbubble.y + padding, "Please slide the " + this.itemName[this.currentItem] + " over to me!", {font: "30px Balsamiq", align: "center", fill:'#666', wordWrap: true, wordWrapWidth: speechspace});
    this.speechgroup.add(txt);

    itemTile = this.add.sprite(xpos, txt.y + txt.height + padding, this.itemTile[this.currentItem]);
    itemTile.width = tilesize;
    itemTile.height = tilesize;
    this.speechgroup.add(itemTile);

    surfaceTile = this.add.sprite(xpos, itemTile.y + itemTile.height + padding, this.surfaceTile[this.currentSurface]);
    surfaceTile.width = tilesize;
    surfaceTile.height = tilesize;
    this.speechgroup.add(surfaceTile);

    itemName = this.add.text(itemTile.x + itemTile.width + padding, itemTile.y + 7, this.itemName[this.currentItem], {font: "30px Fredoka", align: "center", fill:'#5FBEEE'});
    this.speechgroup.add(itemName);

    surfaceName = this.add.text(surfaceTile.x + surfaceTile.width + padding, surfaceTile.y + 7, this.surfaceNameCapital[this.currentSurface] + " surface", {font: "30px Fredoka", align: "center", fill:'#5FBEEE'});
    this.speechgroup.add(surfaceName);

    itemWeight = this.add.text(itemTile.x + itemTile.width + padding, itemName.y + itemName.height + 10, /*this.itemWeight[this.currentItem] + "ml (" +*/ this.itemShortDescription[this.currentItem], {font: "30px Balsamiq", align: "center", fill:'#666'});
    this.speechgroup.add(itemWeight);

    surfaceFriction = this.add.text(surfaceTile.x + surfaceTile.width + padding, surfaceName.y + surfaceName.height + 10, this.surfaceFrictionText[this.currentSurface] + " friction", {font: "30px Balsamiq", align: "center", fill:'#666'});
    this.speechgroup.add(surfaceFriction);
}

// give feedback after pushes in the speech bubble.
Slider.Game.prototype.updateSpeechPostRound = function(scoreRating) {

    var padding = 30;
    var xpos = padding + this.speechbubble.x + 200;
    var speechspace = 345;

    if (this.speechgroup) { this.speechgroup.destroy(); }
    this.speechgroup = this.add.group();


    if (scoreRating == "bad") {

        txt = this.add.text(xpos, this.speechbubble.y + padding, "Nooo! Push the " + this.itemName[this.currentItem] + " with less force!", {
            font: "30px Balsamiq",
            align: "center",
            fill: '#B0475A',
            wordWrap: true,
            wordWrapWidth: speechspace
        });

        meme = this.add.sprite(0, txt.y + txt.height + padding, 'badmeme');
        meme.x = txt.x;
        meme.width =  txt.width;
        meme.height = meme.height/1.8;

    } else if (scoreRating == "normal") {

        txt = this.add.text(xpos, this.speechbubble.y + padding, "Good job! Next time, you can push the " + this.itemName[this.currentItem] + " with a little more force.", {
            font: "30px Balsamiq",
            align: "center",
            fill: '#006BA0',
            wordWrap: true,
            wordWrapWidth: speechspace
        });

        meme = this.add.sprite(0, txt.y + txt.height + padding, 'normalmeme');
        meme.x = txt.x;
        meme.width = txt.width;
        meme.height = meme.height/1.5;


    } else if (scoreRating == "good") {

        txt = this.add.text(xpos, this.speechbubble.y + padding, "WOW! You pushed the " + this.itemName[this.currentItem] + " with just the right amount of force!", {
            font: "30px Balsamiq",
            align: "center",
            fill: '#3CB042',
            wordWrap: true,
            wordWrapWidth: speechspace
        });

        meme = this.add.sprite(0, txt.y + txt.height + padding, 'goodmeme');
        meme.x = txt.x;
        meme.width = txt.width;
        meme.height = meme.height/1.5;

    } else {
        console.log("Invalid scoreRating. Enter bad, normal or good.");
    }


    this.speechgroup.add(txt);
    this.speechgroup.add(meme);
}

// show the round review
Slider.Game.prototype.showRoundReview = function() {
    
}

// = = = = = = = = = = = = = = = = =
// Sensor stuff
// = = = = = = = = = = = = = = = = =

// Get the JSON data string from the IP address.
Slider.Game.prototype.httpGet = function(theUrl) {
    if (this.xmlHttp) {
        this.xmlHttp = null;
    }
    this.xmlHttp = new XMLHttpRequest();
    this.xmlHttp.open("GET", theUrl, false);
    this.xmlHttp.send(null);
    return this.xmlHttp.responseText;
};

// Get the accelerometer value! Call this every update
Slider.Game.prototype.getSensorValue = function() {
    var sensorData = JSON.parse(this.httpGet(Slider.ipAddress)).sensors;

    // goes through sensor data to find linear acceleration
    for (var m = 0; m < sensorData.length; m++) {
        if (sensorData[m].type == 'linear_acceleration') {
            return sensorData[m].values; // return lin_acc_y value
        }
    }
};

// = = = = = = = = = = = = = = = = =
// State changing
// = = = = = = = = = = = = = = = = =

Slider.Game.prototype.showScore = function() {
    if (this.currentRoundScore != 0 && !this.showedScore) {
        // update score array
        var playerNo = this.currentPlayer-1;
        this.currentScores[playerNo] += this.currentRoundScore;

        // local variables
        var scorePadding = 30;
        var myself = this;

        // play appropriate sound
        if (this.currentRoundScore > 60) {
            this.manyPointsSound.play();
        } else {
            this.pointsSound.play();
        }

        // display score near sprite
        this.scoreText = this.add.text(this.player.x + this.player.width + scorePadding, this.player.y - scorePadding, "+" + this.currentRoundScore, {
            font: "50px Fredoka",
            align: "left",
            fill: '#FF423C'
        });
        this.scoreText.alpha = 0;
        this.add.tween(this.scoreText).to( { alpha: 1 }, 500, Phaser.Easing.Cubic.InOut, true);

        // update scoreboard
        this.updateScoreboard();

        // destroy score after a while
        game.time.events.add(2000, function() { myself.scoreText.alpha = 0; });

        // don't update score anymore
        this.showedScore = true;
    }
}

Slider.Game.prototype.calculateCurrentRoundScore = function() {
    var tableLength = Slider.GAME_HEIGHT - this.cat.height;
    this.currentRoundScore = Math.round(((Slider.GAME_HEIGHT-(this.player.y + this.player.height))/tableLength) * 100);
}

Slider.Game.prototype.showCatAnimationAndScore = function() {
    if (this.currentGameState == "postRound") {
        // cup hits cat.
        game.physics.arcade.overlap(this.player, this.boundarySprite, function () {
            this.cat.animations.play("hit");
            this.updateSpeechPostRound("bad");
            this.breakSound.play();
            this.player.destroy();
        }, null, this);

        // cup remains on table. show happy cat and score.
        if (this.player.body.velocity.y === 0) {
            this.calculateCurrentRoundScore();
            this.showScore();
            if (this.currentRoundScore < 60) {
                this.updateSpeechPostRound("normal");
            } else {
                this.updateSpeechPostRound("good");
            }
            this.cat.animations.play("happy");
        }
    }
}

Slider.Game.prototype.resetGameVariables = function() {
    this.currentItem = Math.floor(Math.random() * this.itemName.length);
    this.currentSurface = Math.floor(Math.random() * this.surfaceName.length);
    this.updateScoreboard();
    this.updateTable();
    this.updatePlayer();
    this.updateSpeech();
    this.currMaxValue = 0;
    this.cat.animations.play("idle");
    this.currentGameState = "waitingToPushObject";
    this.showedScore = false;
    game.input.keyboard.removeKey(Phaser.Keyboard.SPACEBAR);
}

Slider.Game.prototype.goToNextRound = function() {
    this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.add(function () {

        // change player or round.
        if (this.currentPlayer < Slider.numberOfPlayers) {
            this.currentPlayer++;
        } else {
            if (this.currentRound < Slider.NUMBER_OF_ROUNDS) {
                this.currentRound++; // go to the next round because the push is over
                this.currentPlayer = 1;
                console.log(this.currentRound + "<-- curr round increment to");
            } else {
                this.currentGameState = "endGame";
                this.endTheGame();
            }
        }

       this.resetGameVariables();
    }, this); //esc to quit
}

Slider.Game.prototype.update = function() {

    if (this.currentGameState == "waitingToPushObject") {
        var sensorValue = this.getSensorValue();
        var magnitude = Math.sqrt((sensorValue[0]*sensorValue[0]) + (sensorValue[1]*sensorValue[1]) + (sensorValue[2]*sensorValue[2]));
        // console.log("For update " + this.frameCount + ", acceleration value is " + sensorValue);

        if (magnitude > this.minSensorValue) { // sensor value is above threshold

           if (this.currMaxValue < magnitude) {
               this.currMaxValue = magnitude;
           } else {
               // value has gone past its peak, time to push the max value
               if (this.currMaxValue > 40) { // limit the speed
                   this.currMaxValue = 40;
               }

               var accelerationValue = -Math.round(this.currMaxValue) * 500 * (300/this.itemWeight[this.currentItem]) * (this.surfaceFrictionMultiplier[this.currentSurface]);

               // push the cup
               this.slideSound.play();
               this.player.body.velocity.y = 0;
               this.player.body.acceleration.set(0, accelerationValue);
               this.physics.arcade.accelerationFromRotation(-Math.PI / 2, 200, new Phaser.Point(0, -9000));
               console.log("Moving up by new currMaxValue = " + this.currMaxValue + " with acc: " + this.player.body.acceleration);

               // destroy the gesture guide once you push
               if (this.gestureguide) { this.gestureguide.destroy(); }

               // next round, switch out of game state.
               this.goToNextRound();
               this.currentGameState = "postRound";
           }

        } else {
            this.player.body.acceleration.set(0); // stop moving, don't do anything if the sensor value is too low
        }

    } else if (this.currentGameState == "postRound") {

        // once player pushes the cup, change cat animation and show score
        this.player.body.acceleration.set(0);
        this.showCatAnimationAndScore();

    } else if (this.currentGameState == "waitingForNextPlayer") {
        this.player.body.acceleration.set(0); // stop moving if the round is over.
    }

    this.frameCount++;
}