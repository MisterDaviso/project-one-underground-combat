/*
    This file is last in the load order
    It compiles all the scenes and creates the game
*/

var config = {
    type: Phaser.CANVAS,
    width: 800,
    height: 600,
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 0},
            debug: true
        }
    },
    scene: [
        BootScene,
        MainMenuScene,
        BattleScene,
        SoulFightScene,
        PlayerUIScene,
    ],
};

var game = new Phaser.Game(config);