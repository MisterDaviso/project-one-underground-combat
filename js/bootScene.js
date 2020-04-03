/*
    This file is strictly for booting up the game
*/
var BootScene = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize:
    
    function BootScene () {
        Phaser.Scene.call(this, {key: 'BootScene'});
    },

    preload: function () {
        // Import the Images Here, specifically the Soul and Enemies
            //this.load.atlas('theTiles', './assets/terrain_images.png', './assets/terrain_images_atlas.json');
        this.load.image("soul", "assets/Soul.png");
        this.load.atlas("monsters", "assets/enemySprites/atlas_files/enemy_sprites.png", "assets/enemySprites/atlas_files/enemy_sprites_atlas.json");
        this.load.atlas("buttons", "assets/buttonSprites/button_sprites.png", "assets/buttonSprites/button_sprites_atlas.json")
    },

    create: function () {
        this.scene.start("BattleScene");
    }
})