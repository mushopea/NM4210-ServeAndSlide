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

    // positioning variables
    var canvasHeight = Slider.GAME_HEIGHT;
    var canvasWidth = Slider.GAME_WIDTH;

    // We're going to be using physics, so enable the Arcade Physics system
    this.physics.startSystem(Phaser.Physics.ARCADE);

    // A simple background for our game
    room = this.add.sprite(0, 0, 'room');
    room.height = canvasHeight;
    room.width = canvasWidth;

    // Cat sprite
    cat = this.add.sprite(0, 0, 'cat');
    proportion = cat.height/cat.width;
    cat.height = cat.height/2;
    cat.width = cat.height/proportion;
    cat.x = canvasWidth/2 - cat.width/2;

    // Cat animations
    cat.animations.add('idle', [0,0,0,1,1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,2,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], 30, true);
    cat.animations.add('hit', [3,4], 100, true);
    cat.animations.add('happy', [5,6], 500, true);
    cat.animations.play("idle");

    // Table
    table = this.add.sprite(0, 0, 'wood');
    table.height = canvasHeight;
    table.width = canvasWidth;

    // Player sprite
    this.player = this.add.sprite(Slider.GAME_WIDTH/2 - 92/2, Slider.GAME_HEIGHT - 129, 'teaCup');
    this.physics.enable(this.player, Phaser.Physics.ARCADE);
    this.player.body.drag.set(100);

    // Score board


    // Quit button
    quitButton = this.add.button(800, 600, 'quit', this.onClickQuitButton, this, 0, 0, 1);
    quitButton.x = canvasWidth - quitButton.width-5;
    quitButton.y = canvasHeight - quitButton.height-5;
    this.game.input.keyboard.addKey(Phaser.Keyboard.ESC).onDown.add(function () { this.onClickQuitButton(); }, this); //esc to quit
}

Slider.Game.prototype.onClickQuitButton = function() {
    // to do: open a ARE YOU FUCKING SURE window.
    // Yes = go back to mainmenu.js. No = continue.
    console.log("Quitting game");
    this.game.time.events.remove(this.timer);
    this.state.start('QuitGame');
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
               this.player.body.acceleration.set(0, -Math.round(this.currMaxValue) * 400);
               this.physics.arcade.accelerationFromRotation(-Math.PI / 2, 100, new Phaser.Point(0, -4500));
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