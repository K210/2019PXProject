//Variables for controls
var cursors; //Arrow Keys
var attackKey; //Attack key (default is Z)
var jumpKey; //Jump key (default is Space bar)
var sprintKey; //Sprint/dash key (default is left shift)
var interactKey; //Talk/interact key (default is C)
var pauseKey; //Pause key (default is P)
var displayMapKey; //Map key (default is M)
var displayBagKey; //Inventory key (default is B)
var inventoryKey; // Inventory key mapped to I
var portalKey;//travel through portals key is mapped to the UP arrow

//Player character
var player; //Player sprite
var attacksound = false; // Variable for attack sound - Used to tell if sound should be played.
var jumpsound = false; // Variable for Jump Sound - Used to tell if sound should be played.

//Map variables
var mapLayer; //Layer with tiles.
var createThis;
var userIntThis;
var currentLevelDialogueJSON; //Current level's JSON dialogue file.
var levelProgress = 1; //Level progress. Used to control NPCs and portals.
var music;
var musicMuted = false; //Is the music muted?
var musicPlaying = false; //Is music playing?
var portalMap; //Which map should a portal warp into?
var musicVolume = 0.7; // global starting music volume,editable via pause menu. 1 = 100%, 0.5 = 50% etc.

//Background layers
var backgroundLayer0;
var backgroundLayer1;

//Variables for test quest system 
var loopcounter = 0; 

/* Controller.
 * Handles the entire game.
 */
class controller extends Phaser.Scene {
    constructor() {
        super({key: 'controller'});
    }
    
    //Preload common assets.
    preload() {
        //Load assets used in all levels
        createThis = this;
        userIntThis = this;
          
        //Main characters
        this.load.spritesheet('medeaSprite','assets/NPC/medea.png',
           { frameWidth: 32, frameHeight: 64 });
        this.load.spritesheet('jason','assets/player/jason.png',
           { frameWidth: 76, frameHeight: 64 });
        this.load.spritesheet('kingSprite','assets/NPC/king.png',
           { frameWidth: 40, frameHeight: 64 });

        //Portal
        this.load.image('portalSprite','assets/items/portal.png');
        
        //Music & Audio
        this.load.audio('female', ['assets/stage/background/female.mp3']);
        this.load.audio('water', ['assets/stage/background/water.mp3']);
        this.load.audio('male',['assets/stage/background/male.mp3']);
        this.load.audio('upbeat', ['assets/stage/background/upbeat.mp3']);
        this.load.audio('jasonIntro', ['assets/stage/background/jasonIntro.mp3']);
        this.load.audio('attack',['assets/stage/background/attack.mp3']);
        this.load.audio('jump',['assets/stage/background/jump.wav']);
        this.load.audio('bite',['assets/stage/background/bite.wav']);

        //Other/Placeholders
        this.load.spritesheet('tempEnemy','assets/enemy/eviljason.png',
           { frameWidth: 48, frameHeight: 48 });
        this.load.image('artemisSprite','assets/NPC/artemis.png');
        this.load.image('bonfireSprite','assets/bonfire.png');
        this.load.image('fireballSprite','assets/fireball.png');
        this.load.image('spiderBossSprite','assets/enemy/spiderBoss.png');
        this.load.image('spiderBossWebSprite','assets/enemy/spiderBossWeb.png');
        this.load.image('medusaBossSprite','assets/enemy/medusaBoss.png');
        this.load.image('bullBossSprite','assets/enemy/bullBoss.png');
        this.load.spritesheet('skeleSprite','assets/enemy/skeleton.png',
            { frameWidth: 30, frameHeight: 45 });

        //Items (must be constantly loaded for inventory)
        this.load.image('spiderFlowerSprite', 'assets/items/flower.png');
        this.load.image('thoughtBubbleSprite', 'assets/npc/thought.png');

        //LEVEL STUFF
        this.load.image('bgSky', 'assets/background/sky.png');
        this.load.image('bgClouds', 'assets/background/clouds.png');
        this.load.image('bgDungeon', 'assets/background/dungeon.png');
        this.load.image('bgForest', 'assets/background/forest.png');
        this.load.image('bgMarket', 'assets/background/market.png');
        this.load.image("tiles", "assets/tilesheet-extruded.png");
        this.load.image('plowSprite','assets/items/plow.png');
        this.load.image('maxHealthItemSprite', 'assets/items/maxHealth.png');
        this.load.image('healthItemSprite', 'assets/items/health.png');
        this.load.image('testItemSprite', 'assets/items/health.png');
        this.load.image('damageIncreaseItemSprite', 'assets/items/damageIncrease.png');

        //Pause
        this.load.image('resumebut', 'assets/stage/background/resumebut.png');
        this.load.image('pausebg', 'assets/stage/background/pausebg.png');
        this.load.image('mapMenu', 'assets/stage/background/mapMenu.png');
        this.load.image('mutebtn', 'assets/stage/background/mutebtn.png');
        this.load.image('volumeupbut', 'assets/stage/background/volumeupbut.png');
        this.load.image('volumedownbut', 'assets/stage/background/volumedownbut.png');
        this.load.image('scrollbg', 'assets/stage/background/scrollbg.png');    

        //SIGNS
        this.load.image('signR2CSprite','assets/items/signR2C.png');
        this.load.image('signMarketSprite','assets/items/signMarket.png');
        this.load.image('signShrineSprite','assets/items/signShrine.png');
        this.load.image('signShrineForestSprite','assets/items/signShrineForest.png');
        this.load.image('signPalaceSprite','assets/items/signPalace.png');
        this.load.image('signColchisFieldsSprite','assets/items/signColchisFields.png');
        this.load.image('signRiverCrossingSprite','assets/items/signRiverCrossing.png');
        this.load.image('signGardenEntranceSprite','assets/items/signGardenEntrance.png');
        this.load.image('signDungeonSprite','assets/items/signDungeon.png');
        this.load.image('signGardenForestSprite','assets/items/signGardenForest.png');
        
                //UIS stuff
        this.load.image('items1', 'assets/background/closeinventbutton.png');
        this.load.image('inventory', 'assets/background/inventorydraft.png');
        
        //load slot preset 
        this.load.image('slots', 'assets/items/inventoryslots.png');
    }

    create() {
        firstInitHealthBar();
        pauseKey = createThis.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
        initDialogueBox();
        inventoryKey = createThis.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I);
        initDialogueBox();

        attackKey = createThis.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        jumpKey = createThis.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        displayBagKey = createThis.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.B);

        var jump = this.sound.add('jump');
        var attack = this.sound.add('attack');
        var bite = this.sound.add('bite');

        game.scene.run(currentLevelID);

        if (['endScreen','titleScreen','mapMenu','introCutscene'].includes(currentLevelID)) {
            userIntThis.scene.sendToBack('controller');
        } else {
            userIntThis.scene.bringToTop('controller');
        }

        this.ritualItemText = userIntThis.add.text(800, 50, '0/x Ritual Items', undefined);
        this.ritualItemText.alpha = 0;

        createThis.anims.create({
        key: 'jasonAttackRight',
        frames: createThis.anims.generateFrameNumbers('jason', { start: 12, end: 29 }),
        frameRate: 30,
        repeat: -1
    });
    }

    update() {
        //open inventory
        if (inventoryKey._justDown){
            game.scene.run('UIS');
        }
        
        //Pause the game if the pause key is held down.
        if (pauseKey.isDown) {
            game.scene.run('pause');
        }

        //Music
        if (!musicPlaying && !musicMuted) {
            if (['endScreen','titleScreen','mapMenu','settingsScreen'].includes(currentLevelID)) {
                music = this.sound.add('water', {loop: true});
                music.play();
                music.setVolume(musicVolume);
            } else if (['colchisFields','gardenFleece'].includes(currentLevelID)) {
                music = this.sound.add('male', {loop: true})
                music.play();
                music.setVolume(musicVolume);
            } else if (['siren'].includes(currentLevelID)) {
                music = this.sound.add('upbeat', {loop: true})
                music.play();
                music.setVolume(musicVolume);
            } else if (['introCutscene'].includes(currentLevelID)) {
                music = this.sound.add('jasonIntro', {loop: true})
                music.play();
                music.setVolume(musicVolume);
            } else {
                music = this.sound.add('female', {loop: true});
                music.play();
                music.setVolume(musicVolume);
            }
            musicPlaying = true;
        }
        //Dont play sounds on these Scenes.
        if (['endScreen','titleScreen','mapMenu','settingsScreen','introCutscene','siren'].includes(currentLevelID))
            {
                jumpsound = false;
                attacksound = false;
            }

        // When character Jumps, play the jump sound
        if(!jumpKey.isDown)
            {
                jumpsound = true;
            }


        if (jumpKey.isDown && jumpsound)
            {
                this.sound.play('jump');
                jumpsound = false;
            }


       //When character Attacks, play the attack sound.
        if (!attackKey.isDown)
            {
                attacksound = true;
            }
        if (attackKey.isDown && attacksound )
            {
           this.sound.play('attack');
                attacksound = false;
            }
        
       

    }
    updateRitualItemText() {
        var tempCount = 0;
        for (i = 0; i < ritualItemCount; i++){
            tempCount += (1 * inventory[i]);
        }

        //Update the text.
        if (tempCount != ritualItemCount){
            userIntThis.ritualItemText.setText(tempCount + '/' + ritualItemCount + " Ritual Items.");
            userIntThis.ritualItemText.alpha = 1;
        } else {
            userIntThis.ritualItemText.alpha = 0;
            if (levelProgress === 4)
            {
                levelProgress++;
            }
        }
    }

    updateSkeletonText() {
        //Update the text.
        //Variable Re-use
        userIntThis.ritualItemText.setText(skelesRemain  + " skeletons remain");
        userIntThis.ritualItemText.alpha = 1;

    }
}

//Preload code common to all levels.
function commonPreload() {
    //load map
    createThis.load.tilemapTiledJSON(currentLevelID + 'Tilemap', 'assets/'+ currentLevelID + '.json');

    //load dialogue
    currentLevelDialogueJSON = 'stages/dialogue/' + currentLevelID + '.json';
    loadLevelDialogue();

    //Update resetInventory.
    for (j = 0; j < inventory.length; j++) {
        resetInventory[j] = (inventory[j]);
    }
}

/* Load the level specified in currentLevelID.
 * It is assumed that currentLevelID is a valid value.
 */
function loadMap() {
    destroyOldObjects();
    createThis.physics.world.TILE_BIAS = 64;

    var currentTilemapKey = currentLevelID + 'Tilemap';

    createThis.map = createThis.make.tilemap({ key: currentTilemapKey });

    //set Boundary
    gameWidth = createThis.map.widthInPixels;
    gameHeight = createThis.map.heightInPixels;
    createThis.physics.world.setBounds(0, 0, gameWidth + (200 * playerShip), gameHeight, 64, true, true, false, false);

    //Render background.
    background = createThis.add.image(1024, 576, backgroundLayer0);
    background.setOrigin(1,1);
    background.scrollFactorX = 0;
    background.scrollFactorY = 0;
    background.setDepth(-100);

    if (backgroundLayer0 == 'bgSky') {
        backgroundClouds = createThis.add.image(0, 576, 'bgClouds');
        backgroundClouds.setOrigin(0,1);
        backgroundClouds.scrollFactorX = 0.2;
        backgroundClouds.scrollFactorY = 0;
        backgroundClouds.setDepth(-95);
    }

    if (backgroundLayer1 !== undefined) {
        backgroundLayer1Image = createThis.add.image(0, 576, backgroundLayer1);
        backgroundLayer1Image.setOrigin(0,1);
        backgroundLayer1Image.scrollFactorX = 0.4;
        backgroundLayer1Image.scrollFactorY = 0;
        backgroundLayer1Image.setDepth(-95);
    }

    //Draw tileset/objects
    var tileset = createThis.map.addTilesetImage("tilesheet-extruded", "tiles", 64, 64, 1, 2);
    var mapLayerBG = createThis.map.createStaticLayer("Layer_bg", tileset, 0, 0);
    mapLayer = createThis.map.createStaticLayer("Layer", tileset, 0, 0);
    mapLayer.setDepth(-40);
    mapLayerBG.setDepth(-50);

    //Spawn player.
    var playerSpawnPoint = createThis.map.findObject("Objects", obj => obj.name === "Player Spawn");
    player = createThis.physics.add.sprite(playerSpawnPoint.x, playerSpawnPoint.y, playerSprite);
    player.setCollideWorldBounds(true);

    mapLayer.setCollisionByProperty({ collides: true });
    createThis.physics.add.collider(player, mapLayer);

    //Player animations.
    createThis.anims.create({
        key: 'jasonRight',
        frames: createThis.anims.generateFrameNumbers('jason', { start: 0, end: 11 }),
        frameRate: 10,
        repeat: -1
    });
    createThis.anims.create({
        key: 'jasonAttackRight',
        frames: createThis.anims.generateFrameNumbers('jason', { start: 12, end: 29 }),
        frameRate: 30,
        repeat: -1
    });
    createThis.anims.create({
        key: 'jasonIdleRight',
        frames: createThis.anims.generateFrameNumbers('jason', { start: 0, end: 0 }),
        frameRate: 10,
        repeat: -1
    });

    //Medea animations.
    createThis.anims.create({
        key: 'medeaIdleRight',
        frames: createThis.anims.generateFrameNumbers('medeaSprite', { start: 0, end: 0 }),
        frameRate: 10,
        repeat: -1
    });
    createThis.anims.create({
        key: 'medeaWalkRight',
        frames: createThis.anims.generateFrameNumbers('medeaSprite', { start: 0, end: 7 }),
        frameRate: 10,
        repeat: -1
    });



    //Keyboard input
    //Create default key bindings for up,down,left and right
    cursors = createThis.input.keyboard.createCursorKeys();
    
    attackKey = createThis.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
    jumpKey = createThis.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    interactKey = createThis.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
    displayMapKey = createThis.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);

    sprintKey = createThis.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
    portalKey = createThis.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);


    if (playerShip) {
        player.body.allowGravity = false;
    }

    parseLevelDialogue();
    if (currentLevelID != 'endCutscene'){
        parseHealthBar();
    }

    spawnObjects();

    playerCheckForPortal();

    //Camera
    if (!playerShip) {
        createThis.cameras.main.startFollow(player, false, 0.05, 0.03);
    } else {
        playerOffset = createThis.physics.add.sprite(playerSpawnPoint.x + playerShipOffsetX, playerSpawnPoint.y, playerSprite);
        createThis.cameras.main.startFollow(playerOffset, true, 1, 1);
        playerOffset.alpha = 0;
        playerOffset.allowGravity = 0;
    }
    createThis.cameras.main.setBounds(0, 0, createThis.map.widthInPixels, createThis.map.heightInPixels);

    playerAlive = true;
}

//Call update functions.
function callUpdateFuncs() {
    //Use the appropriate movement function for the level.
    playerMovement();
    
    //Set test quest only once 
    if(loopcounter<1)
    {
        
        testQuest = new questClass("Quest 1");
        testQuest.questName = "testQuest";
        testQuest.questGiver = "Oileus";
        testQuest.questState = "In progress"; 
        testQuest.questCompletionTime = "Ongoing"; 
        testQuest.questDescription = "Test quest - Player must slay all snakes in the tutorial level"
      
        //Completion reward should be set to same structure as pickup item and pushed using bagInventory.push(currentQuest.completionReward) if there is space in the bag
        testQuest.completionReward = "Quest Complete!!"; 
        
        console.log("Quest Name: " + testQuest.questName);
        console.log("Quest Giver: " + testQuest.questGiver);
        console.log("Quest State: " + testQuest.questState);
        console.log("Quest Completion Time: " + testQuest.questCompletionTime);
        console.log("Quest Description: " + testQuest.questDescription);
        
        
        loopcounter += 1; 
    }
    
    //Enemy Movement
    enemyMovement();

    //Check if a player has fallen.
    playerCheckForFall();

    //Run the update() function of each portal.
    portalUpdate();

    //Run the update() function of each NPC.
    npcUpdate();

    //Check if the player has walked away from dialogue.
    if (dialogueActive) {
        playerCheckDialogueWalkAway();
    }
}

//Ship update function.
function shipUpdate() {
    //Should the player move or sink?
    if (playerAlive) {
        playerShipMovement();
    } else {
        playerShipSink();
    }

    //Player offset calculation. Used for the camera offset.
    playerOffset.x = player.x + playerShipOffsetX;
    playerOffset.y = player.y;

    //Check if the player has fallen.
    playerCheckForFall();
}

//Change level to tempNewLevelID (which is required and assumed to be valid).
function changeLevel(tempNewLevelID) {
    oldLevelID = currentLevelID;
    playerShip = false;
    if ((['endScreen','titleScreen','settingsScreen','colchisFields', 'gardenFleece','mapMenu','siren','introCutscene'].includes(currentLevelID)) ||
            (['endScreen','titleScreen','colchisFields', 'gardenFleece','mapMenu','siren','introCutscene'].includes(tempNewLevelID)))
    {
        musicPlaying = false;
        music.stop();
    }
    clearDialogueBox();
    npcDialogue.text = '';
    if (['endScreen','titleScreen','settingsScreen','mapMenu','introCutscene'].includes(tempNewLevelID)) {
        userIntThis.scene.sendToBack('controller');
    } else {
        userIntThis.scene.bringToTop('controller');
    }

    backgroundLayer1 = undefined;
    game.scene.run(tempNewLevelID);
    game.scene.stop(oldLevelID);
}

//Destroy objects in a map. Used when switching to a new map.
function destroyOldObjects() {
    for (i = 0; i < enemyCount; i++){
        enemies[i].destroy();
    }
    for (i = 0; i < npcCount; i++){
        npcs[i].destroy();
    }
    for (i = 0; i < portalCount; i++){
        portals[i].destroy();
    }
    for (i = 0; i < itemCount; i++){
        items[i].destroy();
    }
}

var config = {
    type: Phaser.AUTO,
    width: 1024,
    height: 576,
    scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH,
        mode: Phaser.Scale.FIT,
        width: 1024,
        height: 576
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 900},
            debug: false
        }
    },


    scene: [controller, titleScreen,tutorial,settingsScreen, argoLanding, roadToColchis, marketplace, palace, shrine, shrineForest,
            colchisFields, riverCrossing, gardenEntrance, gardenForest, gardenDungeon, gardenFleece,
            placeholdertestmap, endCutscene, endScreen, siren, pause, UIS, mapMenu, introCutscene]
};

var game = new Phaser.Game(config);
