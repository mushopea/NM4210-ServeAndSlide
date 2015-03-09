var Slider = {};
Slider.Boot = function(game) {};

Slider.Boot.prototype.preload = function() {
    this.load.image('preloaderBar', 'assets/loading-bar.png');
};

Slider.Boot.prototype.create = function() {
    console.log("Enter boot state.");

    // set scale options
    this.input.maxPointers = 1;
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
    this.scale.setScreenSize(true);

    this.state.start('Preloader');
};
