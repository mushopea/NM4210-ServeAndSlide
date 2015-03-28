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
    this.load.image('room', 'assets/background.png');
    this.load.image('speechbubble', 'assets/speech.png');
    this.load.image('round', 'assets/catround.png');
    this.load.image('roundfiled', 'assets/catroundfilled.png');

    // load the sliding cups
    this.load.image('teaCup', 'assets/cup-of-tea.png');
    this.load.image('wineGlass', 'assets/glass-of-wine.png');
    this.load.image('milkBottle', 'assets/bottle-of-milk.png');
    this.load.image('beerBottle', 'assets/barrel-of-beer.png');
    this.load.image('waterJug', 'assets/jug-of-water.png');

    // load surface tex
    this.load.image('wood', 'assets/surfaces/wood.jpg');
    this.load.image('ice', 'assets/surfaces/ice.jpg');
    this.load.image('carpet', 'assets/surfaces/carpet.png');

    // load square tiles of cups and surfaces
    this.load.image('cup1tile', 'assets/tiles/cup1_tile.png');
    this.load.image('cup2tile', 'assets/tiles/cup2_tile.png');
    this.load.image('cup3tile', 'assets/tiles/cup3_tile.png');
    this.load.image('cup4tile', 'assets/tiles/cup4_tile.png');
    this.load.image('cup5tile', 'assets/tiles/cup5_tile.png');
    this.load.image('surface1tile', 'assets/tiles/surface1_tile.png');
    this.load.image('surface2tile', 'assets/tiles/surface2_tile.png');
    this.load.image('surface3tile', 'assets/tiles/surface3_tile.png');

    // load music
    game.load.audio('gameover', 'assets/sounds/gameover.mp3'); // example:    blaster.play();
    game.load.audio('manypoints', 'assets/sounds/manypointsding.mp3');
    game.load.audio('points', 'assets/sounds/pointsding.mp3');
    game.load.audio('sadmeow', 'assets/sounds/sadmeow.mp3');
    game.load.audio('slide1', 'assets/sounds/slide1.mp3');
    game.load.audio('slide2', 'assets/sounds/slide2.mp3');
    game.load.audio('bgm1', 'assets/sounds/bgm2.mp3');
    game.load.audio('bgm2', 'assets/sounds/bgm3.mp3');
    game.load.audio('break', 'assets/sounds/break.mp3');
    game.load.audio('hover', 'assets/sounds/buttonhover.mp3');

    // load sprite sheets
    this.load.spritesheet('cat', 'assets/sprite.png', 313, 459);
    this.load.spritesheet('go', 'assets/button-go.png', 401, 143);
};

Slider.Preloader.prototype.create = function() {
    this.state.start('MainMenu');
};