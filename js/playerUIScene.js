var PlayerUIScene = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize:

    function PlayerUIScene () {
        Phaser.Scene.call(this, {key: "PlayerUIScene"});
    },
    create: function() {
        // Create the main buttons
        this.currentButton = 0;
        var fightButton = new FightButton(this,2,500,"buttons","fightbutton","fightbuttonhighlight","fight");
        this.add.existing(fightButton)
        var actButton = new ActButton(this,200,500,"buttons","actbutton","actbuttonhighlight","act");
        this.add.existing(actButton)
        var itemButton = new ItemButton(this,400,500,"buttons","itembutton","itembuttonhighlight","item");
        this.add.existing(itemButton)
        var mercyButton =  new MercyButton(this,600,500,"buttons","mercybutton","mercybuttonhighlight","mercy")
        this.add.existing(mercyButton)
        this.buttons = [fightButton,actButton,itemButton,mercyButton]
        
        // Add controls
        this.onButtons = true; // Switches between buttons and menu items
        this.input.keyboard.on('keydown', this.onKeyInput, this);

        // Create the Text Box graphic
        this.textBox = this.add.graphics();
        this.textBox.lineStyle(1, 0xffffff);
        this.textBox.strokeRect(2, 200, 796, 250);
        this.displayedBox = new DisplayedBox(this,4,252);
        this.add.existing(this.displayedBox)

        // On Startup
        this.startTurn()
        this.sys.events.on("wake", this.startTurn, this);
    },
    startTurn: function() {
        this.displayedBox.defaultDisplay();
    },
    enemyTurn: function() {
        console.log("Switching to Soul Fight scene...")
        this.scene.switch("SoulFightScene");
    },
    onKeyInput: function(event) {

    }
});

var PrimaryButton = new Phaser.Class({
    Extends: Phaser.GameObjects.Sprite,
    initialize:

    function Button (scene, x, y, texture, frame1, frame2, type) {
        Phaser.GameObjects.Sprite.call(this, scene, x, y, texture, frame1);
        this.frameInactive = frame1,
        this.frameActive = frame2,
        this.type = type
        this.scene = scene;
    },
    changeActive: function() {
        this.setFrame(this.frameActive);
    },
    changeInactive: function() {
        this.setFrame(this.frameInactive);
    },
});
var FightButton = new Phaser.Class({
    Extends: PrimaryButton,
    initialize:
    function FightButton (scene,x,y,texture,frame1,frame2,type) {
        PrimaryButton.call(this,scene,x,y,texture,frame1,frame2,type)
    },
    updateBox: function() {
        this.scene.displayedBox.clear()

    },
    onSubmit: function() {
        this.scene.enemy.currentHP -= this.scene.player.attack;
    },
});
var ItemButton = new Phaser.Class({
    Extends: PrimaryButton,
    initialize:
    function ItemButton (scene,x,y,texture,frame1,frame2,type) {
        PrimaryButton.call(this,scene,x,y,texture,frame1,frame2,type)
        this.items = this.scene.player.items
        this.hasItems = true
        if(this.items.length === 0) {this.hasItems = false}
        else {this.currentItem = 0;}
    },
    onSubmit: function() {

    },
});
var ActButton = new Phaser.Class({
    Extends: PrimaryButton,
    initialize:
    function ActButton (scene,x,y,texture,frame1,frame2,type) {
        PrimaryButton.call(this,scene,x,y,texture,frame1,frame2,type)
    },
    onSubmit: function() {

    },
});
var MercyButton = new Phaser.Class({
    Extends: PrimaryButton,
    initialize:
    function MercyButton (scene,x,y,texture,frame1,frame2,type) {
        PrimaryButton.call(this,scene,x,y,texture,frame1,frame2,type)
    },
    onSubmit: function() {

    },
});
var ButtonBar = new Phaser.Class({
    Extends: Phaser.GameObjects.Container,
    initialize:

    function ButtonBar (scene, x, y) {
        Phaser.GameObjects.Container.call(scene, x, y)
        this.buttons = []
        this.activeButton = 0;
    },
    moveActiveRight: function() {
        this.buttons[this.activeButton].changeInactive();
        this.activeButton++;
        if(this.activeButton >= this.buttons.length) {this.activeButton = 0}
        this.buttons[this.activeButton].changeActive();
    },
    moveActiveLeft: function() {
        this.buttons[this.activeButton].changeInactive();
        this.activeButton--;
        if(this.activeButton < 0) {this.activeButton = this.buttons.length - 1}
        this.buttons[this.activeButton].changeActive();
    },
});

var DisplayedBox = new Phaser.Class({
    Extends: Phaser.GameObjects.Container,
    initialize:

    function NotificationBox(scene,x,y) {
        Phaser.GameObjects.Container.call(this,scene,x,y)
        this.defaultMessage = "It is your turn"
        this.currentItems = [];
        this.menuItemIndex = 0;
        this.scene = scene;
    },
    newDisplay: function(input) {
        foreach(item in input) {

        }
        var displayItem = new DisplayItem(0,this.currentItems.length * 20, input, this.scene);
        this.currentItems.push(displayItem);
        this.add(displayItem);
    },
    defaultDisplay: function() {
        this.clear()
        this.addDisplayItem(this.defaultMessage)
    },
    clear: function() {
        for(var i=0; i<this.currentItems.length; i++) {
            this.currentItems[i].destroy();
        }
        this.currentItems.length = 0;
        this.menuItemIndex = 0;
    },
});
var DisplayItem = new Phaser.Class({
    Extends: Phaser.GameObjects.Text,
    initialize:

    function MenuItem(x,y,text,scene) {
        Phaser.GameObjects.Text.call(this,scene,x,y,text,{color:'#ffffff', align: 'left', fontSize: 15});
    },
    select: function() {
        this.setColor("#f8ff38");
    },
    deselect: function() {
        this.setColor("#ffffff");
    },
});