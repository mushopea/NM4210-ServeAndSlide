Slider.MultiplayerMenu = function(game){
    this.currPlayers = 2;
    this.text = null;
    this.warningText = null;
};

Slider.MultiplayerMenu.prototype.create = function() {
    myself = this;
    canvasHeight = Slider.GAME_HEIGHT;
    canvasWidth = Slider.GAME_WIDTH;
    this.stage.backgroundColor = '#279dbc';

    if (this.chooseText) { this.chooseText.destroy(); }
    if (this.minusButton) { this.minusButton.destroy(); }
    if (this.plusButton) { this.plusButton.destroy(); }
    if (this.gobutton) { this.gobutton.destroy(); }

    // instructions
    this.chooseText = this.add.text(0, 250, "Choose number of players", {font: "80px Balsamiq", align: "center", fill:'#fff'});
    this.chooseText.x = canvasWidth/2 - this.chooseText.width/2;

    // plus and minus buttons
    this.minusButton = this.add.button(300, 555, 'minus', this.decreaseCount, this, 0, 0, 1);
    this.plusButton = this.add.button(Slider.GAME_WIDTH - 300 - 93, 555, 'plus', this.increaseCount, this, 0, 0, 1);

    // number display
    this.refreshCountDisplay();

    // go button
    this.gobutton = this.add.button(0, 0, 'go', this.goToGame, this, 1, 0, 2);
    this.gobutton.x = canvasWidth/2 - this.gobutton.width/2;
    this.gobutton.y = canvasHeight - canvasHeight/3;
}

Slider.MultiplayerMenu.prototype.goToGame = function() {
    Slider.numberOfPlayers = this.currPlayers;
    console.log("Starting multiplayer game. Number of players is " + Slider.numberOfPlayers);
    this.state.start('Game');
}

Slider.MultiplayerMenu.prototype.increaseCount = function() {
    if (this.currPlayers >= Slider.MAX_NUMBER_OF_PLAYERS) {
        console.log("Max number of players reached");
        if (this.warningText) {
            this.warningText.destroy();
        }
        this.warningText = this.add.text(50, this.text.y + 190, "Oops! Max number of players is " + Slider.MAX_NUMBER_OF_PLAYERS + ".", {font: "40px Balsamiq", align: "center", fill:'#d92b2b'});
        this.warningText.x = canvasWidth/2 - this.warningText.width/2;
    } else {
        this.currPlayers++;
        this.refreshCountDisplay();
    }
}

Slider.MultiplayerMenu.prototype.decreaseCount = function() {
    if (this.currPlayers <= 1) {
        console.log("Min number of players reached");
    } else {
        this.currPlayers--;
        this.refreshCountDisplay();
    }
}

Slider.MultiplayerMenu.prototype.refreshCountDisplay = function() {
    if (this.text) {
        this.text.destroy();
    }
    if (this.warningText) {
        this.warningText.destroy();
    }
    this.text = this.add.text(300, 500, this.currPlayers, {font: "200px Balsamiq", align: "center", fill:'#fff'});
    this.text.x = canvasWidth/2 - this.text.width/2;
}
