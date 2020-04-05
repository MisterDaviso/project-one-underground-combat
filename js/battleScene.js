var BattleScene = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize:

    function PlayerUIScene () {
        Phaser.Scene.call(this, {key: "BattleScene"});
    },
    create: function() {    
        // Create the space to show HP
        this.playerHPText = this.add.text(350, 455, '', { fontSize: '15px', fill: '#fff' });

        // When the game starts, and on each subsequent battle, start the battle
        this.startBattle();
        this.sys.events.on("wake", this.startBattle, this);
    },
    startBattle: function() {
        this.scene.setVisible(true)
        this.createCharacters();
        this.updateHealth();
        this.scene.run("PlayerUIScene");
    },
    // Create the primary characters and make them part of the Scene
    createCharacters: function() {
        var player = new Player(6, 5, 0, ["Chocolate","Taffy"]);
        this.player = player;
        var vegetoid = new Enemy(this,400,50,"monsters","vegetoid",1,3,1);
        this.add.existing(vegetoid);
        this.enemy = vegetoid;
    },
    updateHealth: function() {
        this.playerHPText.setText("Player HP: " + this.player.currentHP + " / " + this.player.maxHP)
    },
    endGame: function() {
        console.log("Something is wrong here...")
        this.scene.stop("PlayerUIScene")
        this.scene.stop("SoulFightScene")
        this.scene.setVisible(false)
        this.scene.switch("MainMenuScene")
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