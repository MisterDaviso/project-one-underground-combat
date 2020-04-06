var config = {
    type: Phaser.CANVAS,
    width: 800,
    height: 600,
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 0},
            debug: false,
        }
    },
    scene: [
        BootScene,
        MainMenuScene,
        ItemSelectScene,
        MonsterSelectScene,
        BattleScene,
        SoulFightScene,
        PlayerUIScene,
    ],
};

var game = new Phaser.Game(config);