Slider.PlayerMenu = function(game){};

Slider.PlayerMenu.prototype.create = function() {
    myself = this;
    this.stage.backgroundColor = '#6ed0e3';
    this.hoverSound = game.add.audio('hover');
    this.hoverSound.volume += 2;

    if (this.singleButton) { this.singleButton.destroy(); }
    if (this.multiButton) { this.multiButton.destroy(); }

    this.singleButton = this.add.button(100, 255, 'singleplayer', this.goToGame, this, 1, 0, 1);
    this.multiButton = this.add.button(0, 255, 'multiplayer', this.goToMultiplayerMenu, this, 1, 0, 1);

    this.singleButton.events.onInputOver.add(function(item) {this.hoverSound.play();}, this);
    this.multiButton.events.onInputOver.add(function(item) {this.hoverSound.play();}, this);

    this.singleButton.height = this.singleButton.height * 2;
    this.singleButton.width = this.singleButton.width * 2;
    this.multiButton.height = this.multiButton.height * 2;
    this.multiButton.width = this.multiButton.width * 2;
    this.multiButton.x = Slider.GAME_WIDTH - 100 - this.multiButton.width;
}

Slider.PlayerMenu.prototype.goToGame = function() {
    console.log("Single player selected. Starting the game");
    Slider.numberOfPlayers = 1;
    this.state.start('Game');
}


Slider.PlayerMenu.prototype.goToMultiplayerMenu = function() {
    console.log("Multi player selected.");
    this.state.start('MultiplayerMenu');
}

