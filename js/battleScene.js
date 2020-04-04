var BattleScene = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize:

    function PlayerUIScene () {
        Phaser.Scene.call(this, {key: "BattleScene"});
    },
    create: function() {    
        // Create the characters and display their hit points
        this.createCharacters();
            // Disply the HP here
        
        // When the game starts, and on each subsequent battle, start the battle
        this.scene.run("SoulFightScene")
        this.sys.events.on("wake", this.startBattle, this);
    },
    // Create the primary characters and make them part of the Scene
    createCharacters: function() {
        var player = new Player(20, 5, 0, ["Chocolate","Taffy"]);
        this.player = player;
        var vegetoid = new Enemy(this,400,50,"monsters","vegetoid",15,1,4);
        this.add.existing(vegetoid);
        this.enemy = vegetoid;
    },
    checkGameOver: function () {
        if (this.player.currentHP <= 0) {

        } else if (this.enemy.currentHP <=0 ) {
            
        }
    },
    startBattle: function() {
        // TBD 
    },
});
// Custom class that contains all the data needed for a player
class Player {
    constructor(maxHP, attack, defense, items) {
        this.maxHP = maxHP;
        this.currentHP = maxHP;
        this.attack = attack;
        this.defense = defense;
        this.items = items;
    }
}
// Custom Phaser class that establishes the current enemy
var Enemy = new Phaser.Class({
    Extends: Phaser.GameObjects.Sprite,
    initialize:

    function Enemy (scene,x,y,texture,frame,hp,attack,maxCompassion) {
        Phaser.GameObjects.Sprite.call(this,scene,x,y,texture,frame);
        this.currentHP = hp;
        this.attack = attack;
        this.name = frame;
        this.compassion = 0;
        this.compassionToFriend = maxCompassion;
        this.friend = false;
    },
    // Creates the projectiles that will be launched
    basicAttack: function(scene) {
        this.projectiles = scene.physics.add.group({
            key: "monsters",
            frame: "vegetoid_projectile",
            repeat: 5,
            setXY: { x: 310, y: 200, stepX: 36}
        });
        this.projectiles.children.iterate(function (projectile) {
            projectile.disableBody(true, true)
        });
        return this.projectiles;
    },
    addGravity: function(projectile) {
        projectile.setGravityY(50);
    },
})