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
    this.frameCount = 0;
    this.gameStates = ["waitingForNextPlayer", "waitingToPushObject", "endGame"];
    this.currentGameState = this.gameStates[1];
    this.currentRound = 1;
    this.currentPlayer = 1;
    this.lastRound = 5;
    this.currentItem = Math.floor(Math.random() * this.itemName.length);
    this.currentSurface = Math.floor(Math.random() * this.surfaceName.length);

    // game assets
    this.player = null;

    // sensor values
    this.minSensorValue = 3;
    this.maxSensorValue = 20;
    this.currMaxValue = 0;
    this.avgSensorValue = 0;
    this.numberOfValuesMeasured = 0;


}

Slider.Game.prototype.create = function() {
    // = = = = = = = = = = = = = = = = =
    // Game world
    // = = = = = = = = = = = = = = = = =

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

    // Go back text
    goBackText = this.add.text(15, canvasHeight - 35, "< Back to Player Selection", {font: "20px Balsamiq", align: "center", fill:'#fff'});
}



// Get the JSON data string from the IP address.
Slider.Game.prototype.httpGet = function(theUrl) {
    var xmlHttp = null;
    xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", theUrl, false);
    xmlHttp.send(null);
    return xmlHttp.responseText;
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

        if (magnitude > this.minSensorValue) { // if sensor value is above threshold
           if (this.currMaxValue < magnitude) { // and if sensor value is still increasing, push in progress
               // pushing object
               this.currMaxValue = magnitude;
               //this.numberOfValuesMeasured++;
               //this.avgSensorValue = ((this.avgSensorValue * (this.numberOfValuesMeasured - 1)) + this.currMaxValue)/this.numberOfValuesMeasured;
            } else {
               // value has gone past its peak, time to push the max value
              //this.physics.arcade.accelerationFromRotation(-Math.PI / 2, this.currMaxValue * 150, this.player.body.acceleration);
               if (this.currMaxValue > 11) { this.currMaxValue = 11;}
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