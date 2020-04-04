var MainMenuScene = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize:

    function PlayerUIScene () {
        Phaser.Scene.call(this, {key: "MainMenuScene"});
    },
    create: function() {
        this.textBox = this.add.graphics();
        this.textBox.lineStyle(1, 0xffffff);
        this.textBox.strokeRect(2, 200, 796, 250);
        this.displayedBox = new DisplayedBox(this,4,252);
        this.add.existing(this.displayedBox)

        // Add controls
        this.input.keyboard.on('keydown', this.onInput, this);

        this.onStartup();
        this.sys.events.on("wake", this.onStartup, this);
    },
    onStartup: function() {
        this.displayedBox.newDisplay(["Hit Spacebar to begin!"])
    },
    startBattle: function() {
        this.scene.switch("BattleScene")
    },
    onInput: function() {
        console.log("Reading input...")
        if (event.code === "ArrowUp") {}
        else if (event.code === "ArrowDown") {}
        else if (event.code === "Space") {this.startBattle()}
    },
})