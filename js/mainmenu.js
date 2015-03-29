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

    // display images
        // sunray
    sunray = this.add.sprite(0, 0, 'startsunray');
    sunray.height = Slider.GAME_HEIGHT;
    sunray.width = Slider.GAME_WIDTH;
    sunray.alpha = 0;
    this.add.tween(sunray).to( { alpha: 1 }, 1000, Phaser.Easing.Linear.None, true);
        // cat
    startcat = this.add.sprite(320, 500, 'startcat');
    var proportion = startcat.height/startcat.width;
    startcat.height = Slider.GAME_HEIGHT/2.5;
    startcat.width = startcat.height/proportion;
    this.add.tween(startcat).to( { y: 50 }, 1300, Phaser.Easing.Cubic.Out, true);
        // white circle
    whitecircle = this.add.sprite(0, 0, 'startwhitecircle');
    whitecircle.height = Slider.GAME_HEIGHT;
    whitecircle.width = Slider.GAME_WIDTH;
        // title
    title = this.add.sprite(0, -500, 'starttitle');
    title.height =  Slider.GAME_HEIGHT;
    title.width = Slider.GAME_WIDTH;
    this.add.tween(title).to( { x: 0, y: 0 }, 1500, Phaser.Easing.Bounce.InOut, true);


    // add the button that will start the game
    gobutton = this.add.button(Slider.GAME_WIDTH/2, Slider.GAME_HEIGHT/2, 'go', this.connect, this, 1, 0, 2);
    gobutton.height = gobutton.height/2;
    gobutton.width = gobutton.width/2;
    gobutton.x = Slider.GAME_WIDTH/2 - gobutton.width/2;
    gobutton.y = Slider.GAME_HEIGHT - Slider.GAME_HEIGHT/3.5;

    // powered by sensorendipity
    sensorendipity = this.add.text(10, Slider.GAME_HEIGHT-16, "Powered by Sensorendipity", {font: "16px Balsamiq", align: "center", fill:'#666'});

};

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

