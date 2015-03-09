Slider.Preloader = function(game) {
    Slider.GAME_WIDTH = 800;
    Slider.GAME_HEIGHT = 600;

    // = = = = = = = = = = = = = = = = =
    // Variables shared between states
    // = = = = = = = = = = = = = = = = =
    console.log("Adding global Slider variables.");

    // sensor data
    Slider.ipAddress = "";

    // game variables and limits
    Slider.MAX_NUMBER_OF_PLAYERS = 5;
    Slider.NUMBER_OF_ROUNDS = 5;
    Slider.numberOfPlayers = 1;

    // player scores
    Slider.scores = [];
    for (i = 0; i < Slider.numberOfPlayers; i++) {
        Slider.scores.push(0);
    }

};

Slider.Preloader.prototype.preload = function() {
    console.log("Preloading game assets.");

    // preloader bar
    this.preloadBar = this.add.sprite((Slider.GAME_WIDTH-311)/2, (Slider.GAME_HEIGHT-27)/2, 'preloaderBar');
    this.load.setPreloadSprite(this.preloadBar);

    // stage variables
    this.stage.backgroundColor = '#B4D9E7';

    // load game asset images
    this.load.image('sky', 'assets/sky.png');
    this.load.image('title', 'assets/title.png');

    // load the sliding cups
    this.load.image('teaCup', 'assets/300.png');
    this.load.image('wineGlass', 'assets/500.png');
    this.load.image('milkBottle', 'assets/700.png');
    this.load.image('waterJug', 'assets/1000.png');
    this.load.image('beerBarrel', 'assets/2000.png');

    // load sprite sheets
    this.load.spritesheet('go', 'assets/button-go.png', 401, 143);
};

Slider.Preloader.prototype.create = function() {
    this.state.start('MainMenu');
};