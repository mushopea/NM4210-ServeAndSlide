Slider.Preloader = function(game) {
    Slider.GAME_WIDTH = 1600;
    Slider.GAME_HEIGHT = 1200;

    // = = = = = = = = = = = = = = = = =
    // Variables shared between states
    // = = = = = = = = = = = = = = = = =
    console.log("Adding global Slider variables.");

    // sensor data
    Slider.ipAddress = "";

    // game variables and limits
    Slider.MAX_NUMBER_OF_PLAYERS = 4;
    Slider.NUMBER_OF_ROUNDS = 5;
    Slider.numberOfPlayers = 1;
    Slider.winner = 1;
    Slider.scores = [];
};

Slider.Preloader.prototype.preload = function() {
    console.log("Preloading game assets.");

    // preloader bar
    this.preloadBar = this.add.sprite((Slider.GAME_WIDTH-311)/2, (Slider.GAME_HEIGHT-27)/2, 'preloaderBar');
    this.load.setPreloadSprite(this.preloadBar);

    // stage variables
    this.stage.backgroundColor = '#dcfaff';

    // load game asset images
    this.load.image('startcat', 'assets/startscreen/startcat.png');
    this.load.image('starttitle', 'assets/startscreen/title.png');
    this.load.image('startsunray', 'assets/startscreen/sunray.png');
    this.load.image('startwhitecircle', 'assets/startscreen/whitecircle.png');

    // load ui elements
    this.load.image('room', 'assets/background.png');
    this.load.image('speechbubble', 'assets/speech.png');
    this.load.image('round', 'assets/catround.png');
    this.load.image('roundfilled', 'assets/catroundfilled.png');

    // load the sliding cups
    this.load.image('teaCup', 'assets/cup-of-tea.png');
    this.load.image('wineGlass', 'assets/glass-of-wine.png');
    this.load.image('milkBottle', 'assets/bottle-of-milk.png');
    this.load.image('beerBottle', 'assets/barrel-of-beer.png');
    this.load.image('waterJug', 'assets/jug-of-water.png');

    // load surface tex
    this.load.image('wood', 'assets/surfaces/woodsurface.png');
    this.load.image('ice', 'assets/surfaces/icesurface.png');
    this.load.image('carpet', 'assets/surfaces/carpetsurface.png');

    // load square tiles of cups and surfaces
    this.load.image('teatile', 'assets/tiles/cup1_tile.png');
    this.load.image('winetile', 'assets/tiles/cup2_tile.png');
    this.load.image('milktile', 'assets/tiles/cup3_tile.png');
    this.load.image('beertile', 'assets/tiles/cup4_tile.png');
    this.load.image('watertile', 'assets/tiles/cup5_tile.png');
    this.load.image('woodtile', 'assets/tiles/surface1_tile.png');
    this.load.image('icetile', 'assets/tiles/surface2_tile.png');
    this.load.image('carpettile', 'assets/tiles/surface3_tile.png');

    // load encouragement memes
    this.load.image('goodmeme', 'assets/meme/good.jpg');
    this.load.image('badmeme', 'assets/meme/bad.jpg');
    this.load.image('normalmeme', 'assets/meme/normal.jpg');
    this.load.image('awinnerisyou', 'assets/awiy.png');

    // load music
    game.load.audio('gameover', 'assets/sounds/gameover.mp3'); // example:    blaster.play();
    game.load.audio('manypoints', 'assets/sounds/manypointsding.mp3');
    game.load.audio('points', 'assets/sounds/pointsding.mp3');
    game.load.audio('sadmeow', 'assets/sounds/sadmeow.mp3');
    game.load.audio('slide1', 'assets/sounds/slide1.mp3');
    game.load.audio('slide2', 'assets/sounds/slide2.mp3');
    game.load.audio('bgm', 'assets/sounds/bgm2.mp3');
    game.load.audio('break', 'assets/sounds/break.mp3');
    game.load.audio('hover', 'assets/sounds/buttonhover.mp3');

    // load sprite sheets
    this.load.spritesheet('cat', 'assets/sprite2.png', 205, 301);
    this.load.spritesheet('go', 'assets/button-go.png', 238, 132);
    this.load.spritesheet('singleplayer', 'assets/singleplayer.png', 280, 352);
    this.load.spritesheet('multiplayer', 'assets/multiplayer.png', 280, 351);
    this.load.spritesheet('plus', 'assets/plus.png', 93, 96);
    this.load.spritesheet('minus', 'assets/minus.png', 93, 96);
    this.load.spritesheet('quit', 'assets/quit.png', 29, 45);
    this.load.spritesheet('gestureguide', 'assets/gesture.png', 212, 209);

};

Slider.Preloader.prototype.create = function() {
    this.state.start('MainMenu');
};

$(function() {
    $( "#instructions" ).click(function() {
        swal({   
            title: 'Instructions',
            width: '80',   
            customClass: 'instructions',
            html:  '<div id="owl-example" class="owl-carousel">'
            + '<div class="instructionPage"><div><img src="assets/startscreen/download.png"></div><div><h3>Install Sensorendipity</h3><ol><li><p>Open the Play Store on your Android Phone</p></li><li>Search for "Sensorendipity"</li><li>Download & Install Sensorendipity</li><li>Open Sensorendipity</li></ol></div></div>'
            + '<div class="instructionPage"><div><img src="assets/startscreen/setup.png"></div><div><h3>Setup Sensorendipity</h3><ol><li>Ensure Computer & Phone are connected to the same Wi-Fi Network</li><li><p>Open Sensorendipity</p></li><li>Enter IP Address into Slide n Serve</li><li>Start Playing!</li></ol></div></div>'
        });
        var owl = $("#owl-example");
        $("#owl-example").owlCarousel({
            navigation : true, // Show next and prev buttons
            slideSpeed : 300,
            rewindNav: false,
            navigationText: ["", ""],
            items: 1,
            singleItem:true,
            afterAction: function(){
              if ( this.itemsAmount > this.visibleItems.length ) {
                $('.owl-next').show();
                $('.owl-prev').show();

                $('.owl-next').removeClass('disabled');
                $('.owl-prev').removeClass('disabled');
                if ( this.currentItem == 0 ) {
                  $('.owl-prev').addClass('disabled');
                }
                if ( this.currentItem == this.maximumItem ) {
                  $('.owl-next').addClass('disabled');
                }

              } else {
                $('.owl-next').hide();
                $('.owl-prev').hide();
              }
            }
        });
        $(".owl-next").click(function(){
            owl.trigger('owl.next');
        })
        $(".owl-prev").click(function(){
            owl.trigger('owl.prev');
        })
    });
});