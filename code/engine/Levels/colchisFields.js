class colchisFields extends Phaser.Scene{
    constructor() {
        super({key: 'colchisFields', active: false });
    }

    preload() {
        createThis = this;
        currentLevelID = 'colchisFields';
        backgroundLayer0 = 'bgDragon';
        commonPreload();
        
               this.load.spritesheet('fireBallSprite', 'assets/enemy/FireballSpritesheet.png', { frameWidth: 515, frameHeight: 515 });
        
    }

    create() {
        loadMap();
        
        //King animations. 
        createThis.anims.create({
            key: 'kingIdleLeft',
            frames: createThis.anims.generateFrameNumbers('kingSprite', { start: 0, end: 0 }),
            frameRate: 10,
            repeat: -1
        });
        createThis.anims.create({
            key: 'kingIdleRight',
            frames: createThis.anims.generateFrameNumbers('kingSprite', { start: 1, end: 1 }),
            frameRate: 10,
            repeat: -1
        });

        //Skeleton animations. 
        createThis.anims.create({
            key: 'skeleIdle',
            frames: createThis.anims.generateFrameNumbers('skeleSprite', { start: 0, end: 0 }),
            frameRate: 10,
            repeat: -1
        });
        createThis.anims.create({
            key: 'skeleLeft',
            frames: createThis.anims.generateFrameNumbers('skeleSprite', { start: 0, end: 12 }),
            frameRate: 10,
            repeat: -1
        });
        createThis.anims.create({
            key: 'skeleRight',
            frames: createThis.anims.generateFrameNumbers('skeleSprite', { start: 13, end: 25 }),
            frameRate: 10,
            repeat: -1
        });
        
        this.anims.create({
            key: 'fireBallSprite',
            frames: createThis.anims.generateFrameNumbers('fireBallSprite', { start: 0, end: 5 }),
            frameRate: 10,
            repeat: -1
        });
        
        //Set empty quest on map load 
        setToEmptyQuest();
    }

    update() {
        callUpdateFuncs();

        //Update the plow if it is not stuck.
        if (!plow.stuck){
            plow.update();    
        }
    }
}
