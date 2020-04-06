var BattleScene = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize:

    function PlayerUIScene () {
        Phaser.Scene.call(this, {key: "BattleScene"});
    },
    create: function() {    
        // Create the space to show HP
        this.playerHPText = this.add.text(350, 455, '', { fontSize: '15px', fill: '#fff' });
        this.itemScene = this.scene.get("ItemSelectScene")

        // Create a reference to the Main Menu
        this.mainMenu = this.scene.get("MainMenuScene")
        
        // When the game starts, and on each subsequent battle, start the battle
        this.startBattle();
        this.sys.events.on("wake", this.startBattle, this);
    },
    startBattle: function() {
        if(this.monster){
            this.monster.destroy()
        }
        this.scene.setVisible(true)
        this.createCharacters();
        this.updateHealth();
        this.scene.run("PlayerUIScene");
    },
    // Create the primary characters and make them part of the Scene
    createCharacters: function() {
        // Create the player
        this.player = new Player(10, 1, 0);
        
        // Create the monster
        switch(this.mainMenu.monster) {
            case "Vegetoid":
                this.monster = new VegetoidMonster(this,400,50,"monsters");
                break;
            default:
                this.monster = new FroggitMonster(this,400,50,"monsters");
        }
        this.add.existing(this.monster);

        // Apply the items to the player
        if (this.itemScene.selectedItems === undefined) {this.items = []}
        else {this.items = this.itemScene.selectedItems}

        for (var i=0; i<this.items.length; i++) {
            switch(this.items[i][0]) {
                case "attack":
                    this.player.attack++; break;
                case "defense":
                    this.monster.intimidated(); break;
                case "food":
                    this.player.items.push(this.items[i][1])
            }
        }
    },
    updateHealth: function() {
        this.playerHPText.setText("Player HP: " + this.player.currentHP + " / " + this.player.maxHP)
    },
    endGame: function() {
        this.scene.stop("PlayerUIScene")
        this.scene.stop("SoulFightScene")
        this.scene.setVisible(false)
        this.scene.switch("MainMenuScene")
    },
});

// Custom class that contains all the data needed for a player
class Player {
    constructor(maxHP, attack, defense) {
        this.maxHP = maxHP;
        this.currentHP = maxHP;
        this.attack = attack;
        this.defense = defense;
        this.items = []
    }
}

// Generic monster class
var Monster = new Phaser.Class({
    Extends: Phaser.GameObjects.Sprite,
    initialize:

    function Monster (scene,x,y,texture,frame) {
        Phaser.GameObjects.Sprite.call(this,scene,x,y,texture,frame);
        this.compassion = 0;
        this.friend = false;
        this.attack;
        this.projectiles;
        this.attackScene
    },
    intimidated: function() {
        console.log("Enemy attack was...",this.attack)
        if ((this.attack > 1)) {this.attack--;}
        console.log("Enemy attack is now...",this.attack)
    },
    clearAttack: function() {
        this.collider.destroy()
        this.projectiles.clear(true, true);
        //this.projectiles.destroy()
    },
});
var VegetoidMonster = new Phaser.Class({
    Extends: Monster,
    initialize:

    function VegetoidMonster (scene,x,y,texture) {
        Monster.call(this,scene,x,y,texture,'vegetoid')
        this.currentHP = 12;
        this.compassionToFriend = 4;
        this.attack = 5;
    },
    basicAttack: function(scene) {
        this.projectiles = scene.physics.add.group({
            key: 'monsters',
            frame: 'vegetoid_projectile',
            repeat: 5,
            setXY: { x: 310, y: 200, stepX: 36},
        })
        for (var i=0; i<this.projectiles.children.size; i++) {
            scene.time.delayedCall(i*750,this.projectiles.children.entries[i].setGravityY,[50],this.projectiles.children.entries[i])
        }
    },
});
var FroggitMonster = new Phaser.Class({
    Extends: Monster,
    initialize:

    function FroggitMonster (scene,x,y,texture) {
        Monster.call(this,scene,x,y,texture,'froggit')
        this.currentHP = 6;
        this.compassionToFriend = 2;
        this.attack = 6;
    },
    basicAttack: function(scene) {
        this.projectiles = scene.physics.add.group()
        var frog = this.projectiles.create(480,380,'monsters','froggit_projectile')
        frog.setBounce(1.25)
        frog.setCollideWorldBounds(true)
        frog.setVelocity(-40,-100)
        frog.setGravityY(60)
    },
});