Slider.PlayerMenu = function(game){};

Slider.PlayerMenu.prototype.create = function() {
    myself = this;
    this.stage.backgroundColor = '#6ed0e3';

    if (this.singleButton) { this.singleButton.destroy(); }
    if (this.multiButton) { this.multiButton.destroy(); }

    this.singleButton = this.add.button(80, 100, 'singleplayer', this.goToGame, this, 1, 0, 1);
    this.multiButton = this.add.button(Slider.GAME_WIDTH - 360, 100, 'multiplayer', this.goToMultiplayerMenu, this, 1, 0, 1);
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

