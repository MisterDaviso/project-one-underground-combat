
var SoulFightSceneBeta = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize:

    function SoulFightScene () {
        Phaser.Scene.call(this, {key: "SoulFightSceneBeta"});

    },
    create: function () {
        // Create the Box and set its boundaries
        var soulBox = this.add.graphics()
        soulBox.lineStyle(1, 0xffffff);
        soulBox.strokeRect(300, 200, 200, 200);
        this.physics.world.bounds = new Phaser.Geom.Rectangle(300,200,200,200);

        // Reference the battle as a whole
        this.battleScene = this.scene.get("BattleScene");
        // Reference the Player and create the Soul Sprite
        this.player = this.battleScene.player
        this.soul = this.physics.add.sprite(400, 300, "soul", null)
        this.soul.setScale(0.25)
        this.cursors = this.input.keyboard.createCursorKeys();
        
        // Reference the Enemy (vegetoid) and create a physics group for the projectiles
        this.enemy = this.battleScene.enemy
        this.projectiles = this.enemy.basicAttack(this);
        // Set Colliders
        this.physics.add.collider(this.soul, this.projectiles, this.getHit, null, this)
        this.soul.setCollideWorldBounds(true);
        
        // Get the battle running
        this.startBattle()
        this.sys.events.on("wake", this.startBattle, this);
    },
    update: function (time, delta) {
        this.soul.body.setVelocity(0);
        if (this.cursors.left.isDown) {
            this.soul.body.setVelocityX(-80);
        } else if (this.cursors.right.isDown) {
            this.soul.body.setVelocityX(80);
        }
        if (this.cursors.up.isDown) {
            this.soul.setVelocityY(-80);
        } else if (this.cursors.down.isDown) {
            this.soul.setVelocityY(80);
        }
    },
    startBattle: function () {
        // How Long the battle should last
        this.battleTimer = this.time.addEvent({delay: 7000, callback: this.playerTurn, callbackScope: this})
        
        // Reset the soul's position to center
        this.soul.x = 400;
        this.soul.y = 300;
        
        // Set a loop to enable the projectiles
        let iterator = 0;
        this.projectiles.children.each(function (projectile) {
            projectile.setGravityY(0)
            projectile.enableBody(true, projectile.x, 200, true, true);
            this.time.delayedCall(iterator*750, this.enemy.addGravity, [projectile])
            iterator++;
        }, this)
    },
    getHit: function (soul, projectile) {
        projectile.disableBody(true, true)
        this.player.currentHP -= this.enemy.attack;
        this.battleScene.updateHealth();
        if(this.player.currentHP <= 0) {
            this.playerDies();
        }
    },
    playerTurn: function() {
        console.log("Switching to UI scene...")
        this.scene.switch("PlayerUIScene");
    },
    playerDies: function() {
        this.battleTimer.destroy()
        this.soul.disableBody(true,true)
        this.displayLose = this.add.text(350, 300, 'You Died!', { fontSize: '15px', fill: '#fff' });
        this.time.delayedCall(2000,this.battleScene.endGame, null, this.battleScene)
    },
    startFight: function() {
        // How Long the battle should last
        this.battleTimer = this.time.addEvent({delay: 7000, callback: this.playerTurn, callbackScope: this})
        // Reset the soul's position to center
        this.soul.x = 400;
        this.soul.y = 300;
        // Start the monster's attack. Keep it basic for now.
        this.monster.basicAttack()
    },
    switchPlayerTurn: function() {
        // Clear the projectiles from the screen
        this.monster.clearAttack();
        // Switch scenes
        this.scene.switch("PlayerUIScene");
    }
});


var SoulFightScene = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize:

    function SoulFightScene () {
        Phaser.Scene.call(this, {key: "SoulFightScene"});

    },
    create: function () {
        // Create the Box and set its boundaries
        var soulBox = this.add.graphics()
        soulBox.lineStyle(1, 0xffffff);
        soulBox.strokeRect(300, 200, 200, 200);
        this.physics.world.bounds = new Phaser.Geom.Rectangle(300,200,200,200);

        // Reference the battle as a whole
        this.battleScene = this.scene.get("BattleScene");
        
        // Reference the Player and create the Soul Sprite
        this.player = this.battleScene.player
        this.soul = this.physics.add.sprite(400, 300, "soul", null)
        this.soul.setScale(0.25)
        this.soul.setCollideWorldBounds(true);
        
        // Create controls
        this.cursors = this.input.keyboard.createCursorKeys();
        
        // Reference the Enemy (vegetoid) and a collider for the projectiles
        this.monster = this.battleScene.monster
        
        // Get the battle running
        this.startBattle()
        this.sys.events.on("wake", this.startBattle, this);
    },
    update: function (time, delta) {
        this.soul.body.setVelocity(0);
        if (this.cursors.left.isDown) {
            this.soul.body.setVelocityX(-80);
        } else if (this.cursors.right.isDown) {
            this.soul.body.setVelocityX(80);
        }
        if (this.cursors.up.isDown) {
            this.soul.setVelocityY(-80);
        } else if (this.cursors.down.isDown) {
            this.soul.setVelocityY(80);
        }
    },
    startBattle: function () {
       // How Long the battle should last
       this.battleTimer = this.time.addEvent({delay: 7000, callback: this.playerTurn, callbackScope: this})
       // Reset the soul's position to center
       this.soul.x = 400;
       this.soul.y = 300;
       // Start the monster's attack. Keep it basic for now.
       this.monster.basicAttack(this)
       this.physics.add.collider(this.soul, this.monster.projectiles, this.getHit, null, this)
    },
    getHit: function (soul, projectile) {
        console.log("You take",this.monster.attack,"damage")
        projectile.disableBody(true, true)
        this.player.currentHP -= this.monster.attack;
        this.battleScene.updateHealth();
        if(this.player.currentHP <= 0) {
            this.playerDies();
        }
    },
    playerTurn: function() {
        // Clear the projectiles from the screen
        this.monster.clearAttack();
        // Switch scenes
        this.scene.switch("PlayerUIScene");
    },
    playerDies: function() {
        this.battleTimer.destroy()
        this.soul.disableBody(true,true)
        this.displayLose = this.add.text(350, 300, 'You Died!', { fontSize: '15px', fill: '#fff' });
        this.time.delayedCall(2000,this.battleScene.endGame, null, this.battleScene)
    },
});