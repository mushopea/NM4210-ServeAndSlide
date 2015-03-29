Slider.QuitGame = function(game) {};

Slider.QuitGame.prototype = {
    create: function() {
        this.stage.backgroundColor = '#279dbc';
        this.spacebar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        // add text links
        var menutxt = game.add.text(game.world.centerX, game.world.centerY - 50, "Go to Main Menu", { font: "44px Fredoka", fill: "#fff", align: "center" });
        var plyrtxt = game.add.text(game.world.centerX, game.world.centerY + 50, "Go to Player Select", { font: "44px Fredoka", fill: "#fff", align: "center" });
        menutxt.anchor.set(0.5);
        plyrtxt.anchor.set(0.5);

        // configure hover/press events
        menutxt.inputEnabled = true;
        plyrtxt.inputEnabled = true;
        menutxt.events.onInputOver.add(this.over, this);
        menutxt.events.onInputOut.add(this.out, this);
        menutxt.events.onInputDown.add(this.menuTextPressed, this);
        plyrtxt.events.onInputOut.add(this.out, this);
        plyrtxt.events.onInputDown.add(this.playerTextPressed, this);
        plyrtxt.events.onInputOver.add(this.over, this);
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

