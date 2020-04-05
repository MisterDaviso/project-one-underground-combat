var PlayerUIScene = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize:

    function PlayerUIScene () {
        Phaser.Scene.call(this, {key: "PlayerUIScene"});
    },
    create: function() {
        // Bring in the assets from the BattleScene
        this.battleScene = this.scene.get("BattleScene");
        this.player = this.battleScene.player;
        this.monster = this.battleScene.monster;

        // Create the Text Box graphic
        this.textBox = this.add.graphics();
        this.textBox.lineStyle(1, 0xffffff);
        this.textBox.strokeRect(2, 200, 796, 250);
        this.displayedBox = new DisplayedBox(this,4,252);
        this.add.existing(this.displayedBox)

        // Create the main buttons
        var fightButton = new FightButton(this,100,0,"buttons","fightbutton","fightbuttonhighlight","fight");
        var actButton = new ActButton(this,300,0,"buttons","actbutton","actbuttonhighlight","act");
        var itemButton = new ItemButton(this,500,0,"buttons","itembutton","itembuttonhighlight","item");
        var mercyButton =  new MercyButton(this,700,0,"buttons","mercybutton","mercybuttonhighlight","mercy")
        this.buttons = [fightButton,actButton,itemButton,mercyButton]
        this.buttonBar = new ButtonBar(this,0,500,this.buttons);
        this.add.existing(this.buttonBar)

        // Add controls
        this.input.keyboard.on('keydown', this.onKeyInput, this);
        this.controlsActive = false;

        // On Startup
        this.onStartup()
        this.sys.events.on("wake", this.onStartup, this);
    },
    onStartup: function() {
        this.buttons[2].updateItems();
        this.startTurn();
    },
    startTurn: function() {
        this.buttonBar.activeButton = null;
        this.controlsActive = true;
        this.displayedBox.defaultDisplay();
    },
    monsterTurn: function() {
        console.log("Switching to Soul Fight scene...")
        this.scene.switch("SoulFightScene");
    },
    onKeyInput: function(event) {
        if (this.controlsActive){
            console.log("Reading input...")
            if (event.code === "Space") {this.buttonBar.submitInput();} 
            else if (event.code === "ArrowLeft") {this.buttonBar.moveActiveLeft()} 
            else if (event.code === "ArrowRight") {this.buttonBar.moveActiveRight()}
            else if (this.buttonBar.activeButton && this.buttons[this.buttonBar.activeButton].hasOptions) {
                if (event.code === "ArrowUp") {this.displayedBox.moveOptionUp()} 
                else if (event.code === "ArrowDown") {this.displayedBox.moveOptionDown();}
            }
        }
    },
});

var PrimaryButton = new Phaser.Class({
    Extends: Phaser.GameObjects.Sprite,
    initialize:

    function PrimaryButton (scene, x, y, texture, frame1, frame2, type) {
        Phaser.GameObjects.Sprite.call(this, scene, x, y, texture, frame1);
        this.frameInactive = frame1;
        this.frameActive = frame2;
        this.type = type;
        this.scene = scene;
        this.displayedBox = scene.displayedBox;
        this.player = scene.player;
        this.monster = scene.monster;
        this.endGame = false;
    },
    changeActive: function() {
        this.setFrame(this.frameActive);
    },
    changeInactive: function() {
        this.setFrame(this.frameInactive);
    },
    turnComplete: function() {
        this.scene.controlsActive = false;
        this.changeInactive();
        if (this.endGame) {this.scene.time.delayedCall(2000,this.scene.battleScene.endGame, null, this.scene.battleScene)}
        else {this.scene.time.delayedCall(2000, this.scene.monsterTurn, null, this.scene)}
    },
    onSelect: function() {

    },
});
var FightButton = new Phaser.Class({
    Extends: PrimaryButton,
    initialize:
    function FightButton (scene,x,y,texture,frame1,frame2,type) {
        PrimaryButton.call(this,scene,x,y,texture,frame1,frame2,type)
        this.message = "Attack for " + this.player.attack + " damage"
    },
    onSelect: function() {
        this.displayedBox.newDisplay([this.message])
    },
    onSubmit: function() {
        this.monster.currentHP -= this.player.attack;
        if (this.monster.currentHP <= 0) {
            this.displayedBox.newDisplay(["You killed the monster!"])
            this.endGame = true;
        } else {
            this.displayedBox.newDisplay(["You hit the monster!"])
        }
        this.turnComplete();
    },
});
var ItemButton = new Phaser.Class({
    Extends: PrimaryButton,
    initialize:
    function ItemButton (scene,x,y,texture,frame1,frame2,type) {
        PrimaryButton.call(this,scene,x,y,texture,frame1,frame2,type)
        this.options
        this.hasOptions
    },
    updateItems: function() {
        this.options = this.player.items
        this.hasOptions = this.checkItems()
    },
    onSelect: function() {
        if (this.hasOptions){this.displayedBox.newDisplay(this.options)}
        else {this.displayedBox.newDisplay(["You have no items!"])}
    },
    onSubmit: function(activeOption) {
        if(!this.hasOptions) {return;}
        else {
            this.options.splice(activeOption,1)
            this.player.currentHP += 5;
            if(this.player.currentHP > this.player.maxHP) {this.player.currentHP = this.player.maxHP}
            this.scene.battleScene.updateHealth();
            this.displayedBox.newDisplay(["You regain 5 HP!"]);
            this.checkItems();
            this.turnComplete();
        }
    },
    checkItems: function() {
        if(this.options.length === 0) {return false}
        else {return true}
    },
});
var ActButton = new Phaser.Class({
    Extends: PrimaryButton,
    initialize:
    function ActButton (scene,x,y,texture,frame1,frame2,type) {
        PrimaryButton.call(this,scene,x,y,texture,frame1,frame2,type)
        this.options = ["Inspect","Insult","Compliment","Hug","Flee!"]
        this.hasOptions = true;
    },
    onSelect: function() {
        this.displayedBox.newDisplay(this.options);
    },
    onSubmit: function(activeOption) {
        switch(activeOption) {
            case 0:
                this.inspect(); break;
            case 1:
                this.insult(); break;
            case 2:
                this.compliment(); break;
            case 3:
                this.hug(); break;
            case 4:
                this.flee(); break;
            default:
                console.log("You were supposed to ACT but...")
        }
        this.turnComplete()
    },
    inspect: function() {
        var message
        if ((this.monster.compassion/this.monster.compassionToFriend) >= 1) {
            message = ("The monster looks like it could use a hug")
        } else {
            message = "The monster has "+this.monster.currentHP+" HP and is hostile toward you"
        }
        this.displayedBox.newDisplay([message])
    },
    insult: function() {
        this.displayedBox.newDisplay(["The monster grew intimidated and weaker"]);
        this.monster.intimidated();
    },
    compliment: function() {
        this.displayedBox.newDisplay(["You compliment the monster and its opinion of you grew!"]);
        this.monster.compassion++;
    },
    hug: function() {
        if((this.monster.compassion/this.monster.compassionToFriend) >= 1) {
            this.displayedBox.newDisplay(["You hug the monster. It considers you a friend!"]);
            this.monster.friend = true;
        } else {
            this.displayedBox.newDisplay(["The monster does not yet like you enough to accept a hug"]);
        }
    },
    flee: function() {
        this.displayedBox.newDisplay(["You run away from the monster!"])
        this.endGame = true;
    }
});
var MercyButton = new Phaser.Class({
    Extends: PrimaryButton,
    initialize:
    function MercyButton (scene,x,y,texture,frame1,frame2,type) {
        PrimaryButton.call(this,scene,x,y,texture,frame1,frame2,type)
    },
    onSelect: function() {
        this.displayedBox.newDisplay(["Show mercy?"])
        if (this.monster.friend) {this.displayedBox.options[0].select()}
    },
    onSubmit: function() {
        if (this.monster.friend) {
            this.displayedBox.newDisplay(["The monster waved you goodbye!"])
            this.endGame = true;
        } else {
            this.displayedBox.newDisplay(["The monster still wants to fight!"])
        }
        this.turnComplete();

    },
});
var ButtonBar = new Phaser.Class({
    Extends: Phaser.GameObjects.Container,
    initialize:

    function ButtonBar (scene, x, y, buttons) {
        Phaser.GameObjects.Container.call(this,scene, x, y)
        this.buttons = buttons;
        this.addButtons()
        this.activeButton = null;
        this.displayedBox = scene.displayedBox;
    },
    moveActiveRight: function() {
        if (this.activeButton === null) {
            this.activeButton = 0;
        } else {
            this.buttons[this.activeButton].changeInactive();
            this.activeButton++;
            if(this.activeButton >= this.buttons.length) {this.activeButton = 0}
        }
        this.buttons[this.activeButton].changeActive();
        this.buttons[this.activeButton].onSelect();
    },
    moveActiveLeft: function() {
        if (this.activeButton === null) {
            this.activeButton = this.buttons.length - 1;
        } else {
            this.buttons[this.activeButton].changeInactive();
            this.activeButton--;
            if(this.activeButton < 0) {this.activeButton = this.buttons.length - 1}    
        }
        this.buttons[this.activeButton].changeActive();
        this.buttons[this.activeButton].onSelect();
    },
    submitInput: function() {
        if (this.activeButton != null && !this.buttons[this.activeButton].hasOptions) {
            this.buttons[this.activeButton].onSubmit()
        } else if (this.activeButton != null && this.displayedBox.activeOption != null) {
            this.buttons[this.activeButton].onSubmit(this.displayedBox.activeOption)
        }
    },
    addButtons: function() {
        for(var i=0; i<this.buttons.length; i++) {
            this.add(this.buttons[i])
        }
    },
});

var DisplayedBox = new Phaser.Class({
    Extends: Phaser.GameObjects.Container,
    initialize:

    function NotificationBox(scene,x,y) {
        Phaser.GameObjects.Container.call(this,scene,x,y)
        this.defaultMessage = "It is your turn"
        this.options = [];
        this.activeOption = null;
        this.scene = scene;
    },
    moveOptionUp: function() {
        if (this.activeOption === null) {
            this.activeOption = this.options.length - 1;
        } else {
            this.options[this.activeOption].deselect();
            this.activeOption--;
            if(this.activeOption < 0) {this.activeOption = this.options.length - 1;}
        }
        this.options[this.activeOption].select()
    },
    moveOptionDown: function() {
        if (this.activeOption === null) {
            this.activeOption = 0;
        } else {
            this.options[this.activeOption].deselect()
            this.activeOption++;
            if(this.activeOption >= this.options.length) {this.activeOption = 0}
        }
        this.options[this.activeOption].select()
    },
    newDisplay: function(input) {
        this.clear();
        for (var i=0; i<input.length; i++) {
            var displayItem = new DisplayItem(0,this.options.length * 20, input[i], this.scene);
            this.options.push(displayItem);
            this.add(displayItem);
        }
    },
    defaultDisplay: function() {
        this.clear()
        this.newDisplay([this.defaultMessage])
    },
    clear: function() {
        for(var i=0; i<this.options.length; i++) {
            this.options[i].destroy();
        }
        this.options.length = 0;
        this.activeOption = null;
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