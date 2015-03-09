Slider.Game = function(game) {
    // = = = = = = = = = = = = = = = = =
    // Slider.Game local variables
    // = = = = = = = = = = = = = = = = =
    console.log("Initializing local game variables.");

    // game variables
    this.frameCount = 0;
    this.gameStates = ["waitingForNextPlayer", "waitingToPushObject", "endGame"];
    this.currentGameState = this.gameStates[1];
    this.currentRound = 1;
    this.lastRound = 5;

    // game assets
    this.player = null;

    // sensor values
    this.minSensorValue = 3;
    this.maxSensorValue = 20;
    this.currMaxValue = 0;

    // item values
    this.numberOfItems = 5;
    this.itemName = ["Tea Cup", "Wine Glass", "Milk Bottle", "Water Jug", "Beer Barrel"];
    this.itemWeight = [300, 500, 700, 1000, 2000];
    this.itemImage = ['teaCup', 'wineGlass', 'milkBottle', 'waterJug', 'beerBarrel'];

    // surface values
    this.numberOfSurfaces = 3;
    this.surfaceName = ["wood", "rubber", "ice"];
    this.surfaceFriction = [0.3, 0.6, 0.05]; // source: http://www.engineeringtoolbox.com/friction-coefficients-d_778.html
}

Slider.Game.prototype.create = function() {
    // = = = = = = = = = = = = = = = = =
    // Game world
    // = = = = = = = = = = = = = = = = =

    // We're going to be using physics, so enable the Arcade Physics system
    this.physics.startSystem(Phaser.Physics.ARCADE);

    // A simple background for our game
    this.add.sprite(0, 0, 'sky');

    // Player sprite
    this.player = this.add.sprite(Slider.GAME_WIDTH/2 - 92/2, Slider.GAME_HEIGHT - 129, 'beerBarrel');
    this.physics.enable(this.player, Phaser.Physics.ARCADE);
    this.player.body.drag.set(100);
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
            return sensorData[m].values[1]; // return lin_acc_y value
        }
    }
};

Slider.Game.prototype.update = function() {

    if (this.currentGameState == "waitingToPushObject" && this.currentRound === 1 /*to prevent multiple pushes. change this later*/) {
        var sensorValue = this.getSensorValue();
        // console.log("For update " + this.frameCount + ", acceleration value is " + sensorValue);

        if (sensorValue > this.minSensorValue) { // if sensor value is above threshold
           if (this.currMaxValue < sensorValue) { // and if sensor value is still increasing, push in progress
                // pushing object
                this.currMaxValue = sensorValue;
            } else {
               // value has gone past its peak, time to push the max value
               this.physics.arcade.accelerationFromRotation(-Math.PI/2,  this.currMaxValue*450, this.player.body.acceleration);
               console.log("Moving up by new currMaxValue = " + this.currMaxValue);
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