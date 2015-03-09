Slider.Game = function(game) {
    // = = = = = = = = = = = = = = = = =
    // Slider.Game local variables
    // = = = = = = = = = = = = = = = = =
    console.log("Initializing local game variables.");
    // item values
    this.frameCount = 0;

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

    //  We're going to be using physics, so enable the Arcade Physics system
    this.physics.startSystem(Phaser.Physics.ARCADE);

    //  A simple background for our game
    this.add.sprite(0, 0, 'sky');
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
    var sensorValue = this.getSensorValue();
    console.log("For update " + this.frameCount + " sensor value is " + sensorValue);

    this.frameCount++;
}