Slider.Preloader = function(game) {
    Slider.GAME_WIDTH = 800;
    Slider.GAME_HEIGHT = 600;
};

Slider.Preloader.prototype.preload = function() {
    console.log("Preloading game assets.");
    
    this.stage.backgroundColor = '#B4D9E7';

    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.spritesheet('dude', 'assets/dude.png', 32, 48);

    // load item images
    this.load.image('teaCup', 'assets/300.png');
    this.load.image('wineGlass', 'assets/500.png');
    this.load.image('milkBottle', 'assets/700.png');
    this.load.image('waterJug', 'assets/1000.png');
    this.load.image('beerBarrel', 'assets/2000.png');
};

Slider.Preloader.prototype.create = function() {
    this.state.start('MainMenu');
};