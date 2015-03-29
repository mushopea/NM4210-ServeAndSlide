Slider.Game = function(game) {
    // = = = = = = = = = = = = = = = = =
    // Slider.Game local variables
    // = = = = = = = = = = = = = = = = =
    console.log("Initializing local game variables.");

    /* **********************************
    // Reminder: Slider global variables are:
    Slider.MAX_NUMBER_OF_PLAYERS = 3;
    Slider.NUMBER_OF_ROUNDS = 5;
    Slider.numberOfPlayers = 1;
    *********************************** */

    // item values
    this.itemName = ["Tea Cup", "Wine Glass", "Milk Bottle", "Beer Bottle", "Water Jug"];
    this.itemWeight = [100, 200, 300, 500, 700];
    this.itemImage = ['teaCup', 'wineGlass', 'milkBottle', 'beerBottle', 'waterJug'];

    // surface values
    this.surfaceName = ["wood", "rubber", "ice"];
    this.surfaceFriction = [0.3, 0.6, 0.05]; // source: http://www.engineeringtoolbox.com/friction-coefficients-d_778.html

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
    console.log("Game Create function called");

    // initialize game vars
    this.player = null;

    // initialize curr state maintenance vars
    this.currentRound = 1;
    this.currentPlayer = 1;
    this.currentItem = Math.floor(Math.random() * this.itemName.length);
    this.currentSurface = Math.floor(Math.random() * this.surfaceName.length);
    this.currentGameState = this.gameStates[1];
    this.currentScores = [];
    for (var m = 0; m < Slider.numberOfPlayers; m++) {
        this.currentScores.push(100);
    }

    this.initPhysics();
    this.initUI();
}

Slider.Game.prototype.initPhysics = function() {
    // We're going to be using physics, so enable the Arcade Physics system
    this.physics.startSystem(Phaser.Physics.ARCADE);

    // Player sprite properties
    this.player = this.add.sprite(Slider.GAME_WIDTH/2 - 92/2, Slider.GAME_HEIGHT - 129, 'teaCup');
    this.physics.enable(this.player, Phaser.Physics.ARCADE);
    this.player.body.drag.set(100);
}

// draw all the UI elements
Slider.Game.prototype.initUI = function() {
    this.initRoom();
    this.initCat();
    this.initTable();
    this.initQuitBtn();
    this.initScoreboard();
    this.initSpeechBubble();
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
    var canvasHeight = Slider.GAME_HEIGHT;
    var canvasWidth = Slider.GAME_WIDTH;

    // Cat sprite
    this.cat = this.add.sprite(0, 0, 'cat');
    this.cat.x = canvasWidth/2 - this.cat.width/2;

    // Cat animations
    this.cat.animations.add('idle', [0,0,0,1,1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,2,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], 30, true);
    this.cat.animations.add('hit', [3,4], 100, true);
    this.cat.animations.add('happy', [5,6], 500, true);
    this.cat.animations.play("idle");
}

Slider.Game.prototype.initTable = function() {
    // positioning variables
    var canvasHeight = Slider.GAME_HEIGHT;
    var canvasWidth = Slider.GAME_WIDTH;

    // Table
    this.table = this.add.sprite(0, 0, 'wood');
    this.table.height = canvasHeight;
    this.table.width = canvasWidth;
}

Slider.Game.prototype.initScoreboard = function() {
    //  Score board
    this.scoreboardHeight = 200;
    this.scoreboardWidth = 400;
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
    // Quit button
    this.quitButton = this.add.button(800, 600, 'quit', this.onClickQuitButton, this, 0, 0, 1);
    this.quitButton.height = this.quitButton.height * 2;
    this.quitButton.width = this.quitButton.width * 2;
    this.quitButton.x = canvasWidth - this.quitButton.width-5;
    this.quitButton.y = canvasHeight - this.quitButton.height-5;
    this.game.input.keyboard.addKey(Phaser.Keyboard.ESC).onDown.add(function () { this.onClickQuitButton(); }, this); //esc to quit
}

Slider.Game.prototype.initSpeechBubble = function() {

}



Slider.Game.prototype.shutdown = function() {
    console.log("Game shutdown commencing. Destroying assets.");
    if (this.room) { this.room.destroy(); }
    if (this.cat) { this.cat.destroy(); }
    if (this.table) { this.table.destroy(); }
    if (this.player) { this.player.destroy(); }
    if (this.scoreboard) { this.scoreboard.destroy(); }
    if (this.quitButton) { this.quitButton.destroy(); }
}


Slider.Game.prototype.onClickQuitButton = function() {
    // to do: open a ARE YOU FUCKING SURE window.
    // Yes = go back to mainmenu.js. No = continue.
    console.log("Quitting game");
    this.game.time.events.remove(this.timer);
    this.state.start('QuitGame');
}

// update scoreboard
Slider.Game.prototype.updateScoreboard = function() {
    if (this.roundText) { this.roundText.destroy(); }
    if (this.roundCatGroup) { this.roundCatGroup.destroy(); }
    if (this.playerTextGroup) { this.playerTextGroup.destroy(); }

    // layout values
    var padding = 20;
    var topPadding = 30;
    var roundPadding = 75;
    var playerY = 210;
    var playerIncrement = 80;
    var playerScoreMargin = 280;

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
        txt = this.add.text(padding, playerY + n*playerIncrement, "Player " + playerNo, {font: "40px Fredoka", align: "center", fill:'#000'});
        this.playerTextGroup.add(txt);
    }
    for (var m = 0; m < Slider.numberOfPlayers; m++) {
        var score = this.currentScores[m];
        txt = this.add.text(padding + playerScoreMargin, playerY + m*playerIncrement, score, {font: "40px Fredoka", align: "center", fill:'#000'});
        this.playerTextGroup.add(txt);
    }
}

// update cat's speech
Slider.Game.prototype.updateSpeech = function() {

}

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

Slider.Game.prototype.update = function() {

    if (this.currentGameState == "waitingToPushObject" && this.currentRound === 1 /*to prevent multiple pushes. change this later*/) {
        var sensorValue = this.getSensorValue();
        var magnitude = Math.sqrt((sensorValue[0]*sensorValue[0]) + (sensorValue[1]*sensorValue[1]) + (sensorValue[2]*sensorValue[2]));
        // console.log("For update " + this.frameCount + ", acceleration value is " + sensorValue);

        if (magnitude > this.minSensorValue) { // sensor value is above threshold
           if (this.currMaxValue < magnitude) {
               this.currMaxValue = magnitude;
           } else {
               // value has gone past its peak, time to push the max value
               if (this.currMaxValue > 11) { // limit the speed
                   this.currMaxValue = 11;
               }
               this.player.body.acceleration.set(0, -Math.round(this.currMaxValue) * 400 * 2);
               this.physics.arcade.accelerationFromRotation(-Math.PI / 2, 100 * 2, new Phaser.Point(0, -4500 * 2));
               console.log("Moving up by new currMaxValue = " + this.currMaxValue + " with acc: " + this.player.body.acceleration);
               this.currentRound++; // go to the next round because the push is over
           }
        } else {
            this.player.body.acceleration.set(0); // stop moving, don't do anything if the sensor value is too low
        }
    } else {
        this.player.body.acceleration.set(0); // stop moving if the round is over.
    }

    this.frameCount++;
}