Slider.MainMenu = function(game){};

Slider.MainMenu.prototype.create = function() {
    // show IP address textbox
    // to do: make responsive (scale according to window size)
    myself = this;
    $("#ip_textbox").show();

    // focus cursor on the box
    var input = $("#ip_textbox");
    var len = input.val().length;
    input[0].focus();
    input[0].setSelectionRange(len, len);

    // set keypress sound and enter event
    $("#ip_textbox").keypress(function(e) {
        if (e.which == 13) {
            myself.connect();
        } else {
            document.getElementById('keypress').play();
        }
    });

    // if game was restarted, destroy previous assets.
    this.destroyAssets();

    // display images
        // sunray
    this.sunray = this.add.sprite(0, 0, 'startsunray');
    this.sunray.height = Slider.GAME_HEIGHT;
    this.sunray.width = Slider.GAME_WIDTH;
    this.sunray.alpha = 0;
    this.add.tween(this.sunray).to( { alpha: 1 }, 1000, Phaser.Easing.Linear.None, true);
        // cat
    this.startcat = this.add.sprite(game.world.centerX, 1600, 'startcat');
    this.startcat.anchor.set(0.5);
    var proportion = this.startcat.height/this.startcat.width;
    this.startcat.height = Slider.GAME_HEIGHT/2;
    this.startcat.width = this.startcat.height/proportion;
    this.add.tween(this.startcat).to( { y: game.world.centerY - this.startcat.height/2 }, 1300, Phaser.Easing.Cubic.Out, true);
        // white circle
    this.whitecircle = this.add.sprite(0, 0, 'startwhitecircle');
    this.whitecircle.height = Slider.GAME_HEIGHT;
    this.whitecircle.width = Slider.GAME_WIDTH;
        // title
    this.title = this.add.sprite(0, -500, 'starttitle');
    this.title.height =  Slider.GAME_HEIGHT;
    this.title.width = Slider.GAME_WIDTH;
    this.add.tween(this.title).to( { x: 0, y: 0 }, 1500, Phaser.Easing.Bounce.InOut, true);

    // add the button that will start the game
    this.gobutton = this.add.button(Slider.GAME_WIDTH/2, Slider.GAME_HEIGHT/2, 'go', this.connect, this, 1, 0, 2);
    this.gobutton.x = Slider.GAME_WIDTH/2 - this.gobutton.width/2;
    this.gobutton.y = Slider.GAME_HEIGHT - Slider.GAME_HEIGHT/3.7;

    // powered by sensorendipity
    this.sensorendipity = this.add.text(10, Slider.GAME_HEIGHT-16, "Powered by Sensorendipity", {font: "32px Fredoka", align: "center", fill:'#666'});
    this.sensorendipity.alpha = 0;
    game.time.events.add(1000, function(){
        this.sensorendipity = null;
        this.sensorendipity = this.add.text(10, Slider.GAME_HEIGHT-32, "Powered by Sensorendipity", {font: "32px Fredoka", align: "center", fill:'#666'});
        this.sensorendipity.alpha = 0;
        this.sensorendipity.inputEnabled = true;
        this.sensorendipity.events.onInputOver.add(function(item) {item.fill = "#2ebaff";}, this);
        this.sensorendipity.events.onInputOut.add(function(item) {item.fill = "#666";}, this);
        this.sensorendipity.events.onInputDown.add(function() { window.open("http://sensorendipity.github.io/"); }, this);
        this.add.tween(this.sensorendipity).to( { alpha: 1 }, 500, Phaser.Easing.Cubic.InOut, true);
    }, this);
};

Slider.MainMenu.prototype.destroyAssets = function() {
    console.log("Destroying existing main menu assets");
    if (this.sunray) { this.sunray.destroy(); }
    if (this.startcat) { this.startcat.destroy(); }
    if (this.title) { this.title.destroy(); }
    if (this.whitecircle) { this.whitecircle.destroy(); }
    if (this.goButton) { this.goButton.destroy(); }
    if (this.sensorendipity) { this.sensorendipity.destroy(); }
}

Slider.MainMenu.prototype.shutdown = function() {
    this.destroyAssets();
}

// = = = = = = = = = = = = = = = = =
// Sensor IP
// = = = = = = = = = = = = = = = = =

// Get the IP address from the textbox.
Slider.MainMenu.prototype.setIP = function() {
    if (document.getElementById("ip_textbox").value.toString().indexOf("http://") == 0) {
        Slider.ipAddress = document.getElementById("ip_textbox").value; // input_ip_address is the textbox that asks for the IP.
    } else {
        // append http:// in front if the students forgets to
        Slider.ipAddress = "http://" + document.getElementById("ip_textbox").value.toString(); // input_ip_address is the textbox that asks for the IP.
    }
};

// Get the JSON data string from the IP address.
Slider.MainMenu.prototype.httpGet = function(theUrl) {
    var xmlHttp = null;
    xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", theUrl, false);
    xmlHttp.send(null);
    return xmlHttp.responseText;
};

// Connect the phone to the desktop game, through IP address --> call this in the first game screen
Slider.MainMenu.prototype.connect = function() {
    this.setIP();

    // Try to get the initial data of the server. If the IP is incorrect, this gives a pop-up.
    try {
        // validate the IP then start the game.
        sensorJSON = JSON.parse(this.httpGet(Slider.ipAddress)).sensors;
        $("#ip_textbox").hide();
        $("#instructions").hide();
        this.destroyAssets();
        console.log("Validated IP address " + Slider.ipAddress + ". Starting game now");
        this.state.start('PlayerMenu');
    } catch (e) {
        // notify the user that the address invalid
        swal({
            title: "Oops!",
            text: "Invalid IP address. Please re-enter!",
            imageUrl: "assets/oops.png"
        });
    }
};

