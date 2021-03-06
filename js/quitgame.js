Slider.QuitGame = function(game) {};

Slider.QuitGame.prototype = {
    create: function() {
        this.stage.backgroundColor = '#279dbc';
        this.spacebar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        if (this.menutxt) { this.menutxt.destroy(); }
        if (this.plyrtxt) { this.plyrtxt.destroy(); }
        if (this.maintxt) { this.maintxt.destroy(); }

        // game over
        this.mainTxt = game.add.text(game.world.centerX, 0, "Game Over", { font: "200px Fredoka", fill: "#C2E9FF", align: "center" });
        this.mainTxt.anchor.set(0.5);
        this.add.tween(this.mainTxt).to( { y: 380 }, 1500, Phaser.Easing.Circular.Out, true);

        // add text links
        this.menutxt = game.add.text(game.world.centerX, game.world.centerY, "Go to Main Menu", { font: "44px Fredoka", fill: "#fff", align: "center" });
        this.plyrtxt = game.add.text(game.world.centerX, game.world.centerY + 100, "Go to Player Select", { font: "44px Fredoka", fill: "#fff", align: "center" });
        this.menutxt.anchor.set(0.5);
        this.plyrtxt.anchor.set(0.5);

        // configure hover/press events
        this.menutxt.inputEnabled = true;
        this.plyrtxt.inputEnabled = true;
        this.menutxt.events.onInputOver.add(this.over, this);
        this.menutxt.events.onInputOut.add(this.out, this);
        this.menutxt.events.onInputDown.add(this.menuTextPressed, this);
        this.plyrtxt.events.onInputOut.add(this.out, this);
        this.plyrtxt.events.onInputDown.add(this.playerTextPressed, this);
        this.plyrtxt.events.onInputOver.add(this.over, this);

        // sound
        this.gameOverSound = game.add.audio('gameover');
        this.gameOverSound.play();
    },

    update: function() {
        if (this.spacebar.isDown) {
            game.state.start('Boot');
        }
    }
};

Slider.QuitGame.prototype.over = function(item) {
    item.fill = "#89e9f3";
}

Slider.QuitGame.prototype.out = function(item) {
    item.fill = "#fff";
}

Slider.QuitGame.prototype.menuTextPressed = function() {
    game.state.start('MainMenu');
}

Slider.QuitGame.prototype.playerTextPressed = function() {
    game.state.start('PlayerMenu');
}

