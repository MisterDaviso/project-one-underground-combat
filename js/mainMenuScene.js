var MainMenuScene = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize:

    function PlayerUIScene () {
        Phaser.Scene.call(this, {key: "MainMenuScene"});
    },
    create: function() {
        // Main Display
        this.title = this.add.text(100,50,"WELCOME TO THE UNDERGROUND",{fontSize:'30px',fill:'#fff'})
        this.instructions = this.add.text(100,150,"Use Arrow keys to move around, Space to select an option, and Escape to leave a selection screen",{fontSize:'20px',fill:'#fff',wordWrap:{width:600,useAdvancedWrap:true}})

        // Main Menu
        this.textBox = this.add.graphics();
        this.textBox.lineStyle(1, 0xffffff);
        this.textBox.strokeRect(2, 200, 796, 250);
        this.displayedBox = new DisplayedBox(this,4,252);
        this.add.existing(this.displayedBox)
        this.monsterSelect = this.scene.get("MonsterSelectScene")

        // Let the player know who they are facing
        this.monsterDescription = this.add.text(400,250,'Your enemy is a:')
        this.monsterText = this.add.text(400,270,this.monster)

        // Add controls
        this.input.keyboard.on('keydown', this.onInput, this);

        this.onStartup();
        this.sys.events.on("wake", this.onStartup, this);
    },
    onStartup: function() {
        this.scene.setVisible(true)
        this.displayedBox.newDisplay(["Begin Game!","Select Items!","Select Monster!"])
        
        this.monster = this.monsterSelect.selectedMonster
        if(this.monster === undefined) {this.monster = "Froggit"}
        this.monsterText.setText(this.monster)
        
    },
    beginGame: function() {
        this.scene.setVisible(false)
        this.scene.switch("BattleScene")
    },
    selectItems: function() {
        console.log("Selected Item Screen")
        this.scene.setVisible(false)
        this.scene.switch("ItemSelectScene")
    },
    selectMonster: function() {
        console.log("Switching to Monster Select screen...")
        this.scene.setVisible(false)
        this.scene.switch("MonsterSelectScene")
    },
    onSubmit: function() {
        switch(this.displayedBox.activeOption) {
            case 0:
                this.beginGame(); break;
            case 1:
                this.selectItems(); break;
            case 2: 
                this.selectMonster(); break;
            default:
                console.log("Nothing is selected")
        }
    },
    onInput: function() {
        console.log("Reading input...")
        if (event.code === "ArrowUp") {this.displayedBox.moveOptionUp()}
        else if (event.code === "ArrowDown") {this.displayedBox.moveOptionDown()}
        else if (event.code === "Space") {this.onSubmit()}
    },
})
var ItemSelectScene = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize:

    function ItemSelectScene () {
        Phaser.Scene.call(this, {key: "ItemSelectScene"})
    },
    create: function() {
        // Scene Title and Description
        this.title = this.add.text(100,50,"Select Items",{fontSize:'30px',fill:'#fff'})
        this.description = this.add.text(100,100,"You may carry up to 3 items. Weapons increase attack, clothing increases defense, and food can be used during battle to heal you.",{fontSize:'15px',fill:'#fff',wordWrap:{width:600,useAdvancedWrap:true}})

        // The item lists
        this.selectedTitle = this.add.text(25,200,"SELECTED ITEMS")
        this.selectedItemsList = new DisplayedBox(this,25,250);
        this.add.existing(this.selectedItemsList)
        this.selectedItems = []
        this.availableTitle = this.add.text(425,200,"AVAILABLE ITEMS")
        this.availableItemsList = new DisplayedBox(this,425,250);
        this.add.existing(this.availableItemsList)
        this.availableItems = [
            ['attack','Kitchen Knife'],
            ['attack','Heavy Hammer'],
            ['defense','Thick Coat'],
            ['defense','Sturdy Hat'],
            ['food','Bar of Chocolate'],
            ['food','Slice of Pizza'],
            ['food','Can of Cola']
        ]
        
        // Add the controls
        this.input.keyboard.on('keydown',this.onKeyInput,this);
        this.lists = [this.selectedItemsList,this.availableItemsList]
        this.activeList = this.availableItemsList;
        this.inactiveList = this.selectedItemsList;

        // When this screen starts up
        this.onStartup();
        this.sys.events.on("wake", this.onStartup, this);
    },
    onStartup: function() {
        "Select Item Startup..."
        this.scene.setVisible(true)
        this.updateLists()
    },
    backToMain: function() {
        this.scene.setVisible(false)
        this.scene.switch("MainMenuScene")
    },
    updateLists: function() {
        var selected = this.selectedItems.map((pair) => {return pair.slice(1)})
        this.selectedItemsList.newDisplay(selected)
        var available = this.availableItems.map((pair) => {return pair.slice(1)})
        this.availableItemsList.newDisplay(available)
    },
    onKeyInput: function(event) {
        if(event.code === "ArrowUp") {this.activeList.moveOptionUp()}
        else if(event.code === "ArrowDown") {this.activeList.moveOptionDown()}
        else if(event.code === "ArrowLeft" || event.code === "ArrowRight") {this.switchActiveList()}
        else if(event.code === "Space") {this.switchItem()}
        else if(event.code === "Escape") {this.backToMain()}
    },
    switchActiveList: function() {
        console.log("Switching Lists...")
        
        // If there is nothing to switch to, don't
        if (this.inactiveList.options.length === 0) {return}
        // Swap the two lists around
        var tempList = this.inactiveList;
        this.inactiveList = this.activeList;
        this.activeList = tempList;

        // If there is a horizontal transfer, do it, otherwise, next closest
        if (this.activeList.options.length > this.inactiveList.activeOption) {
            this.activeList.activeOption = this.inactiveList.activeOption;
        } else {
            this.activeList.activeOption = this.activeList.options.length -1;
        }
        // Turn the inactive off and the active on.
        if(this.inactiveList.options != 0) {
            this.inactiveList.options[this.inactiveList.activeOption].deselect()
        }
        this.activeList.options[this.activeList.activeOption].select()
    },
    switchItem: function() {
        console.log("Switching Item",this.activeList.activeOption,)
        // If the player has 3 items, don't give them another
        if (this.activeList == this.availableItemsList && this.selectedItemsList.options.length >= 3) {return}

        this.activeOption = this.activeList.activeOption
        if(this.activeList === this.availableItemsList) {
            this.selectedItems.push(this.availableItems[this.activeOption])
            this.availableItems.splice(this.activeOption,1)
        }else if(this.activeList === this.selectedItemsList) {
            this.availableItems.push(this.selectedItems[this.activeOption])
            this.selectedItems.splice(this.activeOption,1)
        }

        this.updateLists();
        if(this.activeList.options.length === 0) {
            console.log("This list reads empty...")
            this.activeList.activeOption = 0;
            this.switchActiveList();
        } else if (this.activeOption > 0 && this.activeList.options.length === this.activeOption) {
            this.activeList.activeOption = this.activeOption - 1;
        } else {
            this.activeList.activeOption = this.activeOption
        }
        this.activeList.options[this.activeList.activeOption].select()
    }
});
var MonsterSelectScene = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize:

    function EnemySelectScene () {
        Phaser.Scene.call(this, {key: "MonsterSelectScene"})
    },
    create: function() {
        // Scene Title and Description
        this.title = this.add.text(100,50,"Select Monster to Fight",{fontSize:'30px',fill:'#fff'})
        //this.description = this.add.text(100,100,"You may carry up to 3 items. Weapons increase attack, clothing increases defense, and food can be used during battle to heal you.",{fontSize:'15px',fill:'#fff',wordWrap:{width:600,useAdvancedWrap:true}})

        // Create the monsters to select
        this.froggit = this.add.sprite(200,200,'monsters','froggit')
        this.froggitButton = new PrimaryButton(this,200,0,'buttons','fightbutton','fightbuttonhighlight','monsterSelect')
        this.vegetoid = this.add.sprite(600,200,'monsters','vegetoid')
        this.vegetoidButton = new PrimaryButton(this,600,0,'buttons','fightbutton','fightbuttonhighlight','monsterSelect')
        this.buttons = [this.froggitButton,this.vegetoidButton]
        this.buttonBar = new ButtonBar(this,0,400,this.buttons)
        this.add.existing(this.buttonBar)
        this.selectedMonster = "Froggit"

        // Add controls to the scene
        this.input.keyboard.on('keydown', this.onKeyInput, this);

        // On startup
        this.onStartup()
        this.sys.events.on("wake", this.onStartup, this);
    },
    onStartup: function() {
        this.scene.setVisible(true)
    },
    backToMain: function() {
        if(this.selectedMonster === "Froggit" && this.buttonBar.activeButton != 0) {
            this.buttonBar.moveActiveRight();
        }
        console.log("You selected:",this.selectedMonster,", and index is",this.buttonBar.activeButton)
        this.scene.setVisible(false)
        this.scene.switch("MainMenuScene")
    },
    onKeyInput: function(event) {
        if(event.code === "ArrowLeft") {this.buttonBar.moveActiveLeft()}
        else if(event.code === "ArrowRight") {this.buttonBar.moveActiveRight()}
        else if(event.code === "Space") {this.onSubmit()}
        else if(event.code === "Escape") {this.backToMain()}
    },
    onSubmit: function() {
        if (this.buttonBar.activeButton === null) {return}
        else {
            switch(this.buttonBar.activeButton) {
                case 0:
                    this.selectedMonster = "Froggit"; break;
                case 1:
                    this.selectedMonster = "Vegetoid"; break;
                default:
                    console.log("Okay, wait... you didn't select ANY monster?");
            }
        }
        this.backToMain()
    },
})