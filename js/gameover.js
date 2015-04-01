Slider.GameOver = function(game) {};

Slider.GameOver.prototype = {
    create: function() {
        this.stage.backgroundColor = '#000';
        var padding = 100;

        if (this.menutxt) { this.menutxt.destroy(); }
        if (this.plyrtxt) { this.plyrtxt.destroy(); }
        if (this.maintxt) { this.maintxt.destroy(); }
        if (this.awinnerisyou) { this.awinnerisyou.destroy(); }

        // a winner is u
        this.awinnerisyou = game.add.sprite(game.world.centerX, padding*2, 'awinnerisyou');
        this.awinnerisyou.anchor.set(0.5, 0);
        this.awinnerisyou.alpha = 0;
        this.add.tween(this.awinnerisyou).to( { alpha: 100 }, 2000, Phaser.Easing.Circular.Out, true);

        // plaYAAAAaaa!!
        this.mainTxt = game.add.text(game.world.centerX, 0, "Player " + Slider.winner, { font: "145px Fredoka", fill: "#fff", align: "center" });
        this.mainTxt.anchor.set(0.5, 0);
        this.add.tween(this.mainTxt).to( { y: this.awinnerisyou.y + this.awinnerisyou.height + padding }, 1500, Phaser.Easing.Circular.Out, true);

        // add text links
        this.menutxt = game.add.text(game.world.centerX, game.world.centerY + padding*2, "Go to Main Menu", { font: "44px Fredoka", fill: "#fff", align: "center" });
        this.plyrtxt = game.add.text(game.world.centerX, this.menutxt.y + this.menutxt.height + padding/2, "Go to Player Select", { font: "44px Fredoka", fill: "#fff", align: "center" });
        this.menutxt.anchor.set(0.5, 0);
        this.plyrtxt.anchor.set(0.5, 0);

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
    }
};

Slider.GameOver.prototype.over = function(item) {
    item.fill = "#89e9f3";
}

Slider.GameOver.prototype.out = function(item) {
    item.fill = "#fff";
}

Slider.GameOver.prototype.menuTextPressed = function() {
    game.state.start('MainMenu');
}

Slider.GameOver.prototype.playerTextPressed = function() {
    game.state.start('PlayerMenu');
}

