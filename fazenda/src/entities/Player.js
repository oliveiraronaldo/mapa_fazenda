import { CONFIG } from "../config";

export default class Player extends Phaser.Physics.Arcade.Sprite{
    /**@type {Phaser.Type.Input.Keyboard.CursorKeys} */
    cursors;

    touch;

    isAction = false;   //diz dse a tecla espaço (de ação) está precionada

    constructor(scene, x, y, touch){
        super(scene, x, y, 'player');

        this.touch = touch;
        
        scene.add.existing(this);   //criando a imagem que o jogador vê
        scene.physics.add.existing(this);   //criando o body da fisica

        this.init();
    }

    init(){
        this.setFrame(0);

        this.speed = 120;
        this.frameRate = 8;
        this.direction = 'down';
        this.cursors = this.scene.input.keyboard.createCursorKeys();


        this.setOrigin(0.5, 0.5);

        this.body.setSize(12,8);
        this.body.setOffset(18,23);
        
        this.initAnimations();

        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);

        this.play('idle-right');
    }

    update(){
        const{ left, right, down, up, space } = this.cursors;

        if(left.isDown){
            this.setVelocityX(-this.speed);
            this.direction = 'left';
        }else if(right.isDown){
            this.setVelocityX(this.speed);
            this.direction = 'right';
        }else{
            this.setVelocityX(0);
        }

        if(up.isDown){
            this.setVelocityY(-this.speed);
            this.direction = 'up';
        }else if(down.isDown){
            this.setVelocityY(this.speed);
            this.direction = 'down';
        }else{
            this.setVelocityY(0);
        }

        if(space.isDown){
            this.isAction = true;
        }else{
            this.isAction = false;
        }

        //mudar a animação
        if(this.body.velocity.x == 0 && this.body.velocity.y == 0){
            //parado
            this.play('idle-' + this.direction, true);
        }else{
            //movimento
            this.play('walk-' + this.direction, true);
        }

        //fazer o touch seguir o player
        let tx, ty;
        let distance = 8;
        switch (this.direction) {
            case 'down':
                tx = -8;
                ty = distance;
                break;
            
            case 'up':
                tx = -8;
                ty = distance - 12;
                break;

            case 'left':
                tx = -15;
                ty = CONFIG.TILE_SIZE / 3;
                break;
            
            case 'right':
                tx = -2;
                ty = CONFIG.TILE_SIZE / 3;
                break;
            
        }

        this.touch.setPosition(this.x + tx + CONFIG.TILE_SIZE/2, this.y +ty);
    }

    initAnimations(){
        this.anims.create({
            key: 'idle-right',
            frames: this.anims.generateFrameNumbers('player',{
                start: 24, end: 31}),
                frameRate: this.frameRate,
                repeat: -1
        });

        this.anims.create({
            key: 'idle-up',
            frames: this.anims.generateFrameNumbers('player',{
                start: 8, end: 15}),
                frameRate: this.frameRate,
                repeat: -1
        });

        this.anims.create({
            key: 'idle-left',
            frames: this.anims.generateFrameNumbers('player',{
                start: 16, end: 23}),
                frameRate: this.frameRate,
                repeat: -1
        });

        this.anims.create({
            key: 'idle-down',
            frames: this.anims.generateFrameNumbers('player',{
                start: 2, end: 7}),
                frameRate: this.frameRate,
                repeat: -1
        });

        this.anims.create({
            key: 'walk-right',
            frames: this.anims.generateFrameNumbers('player',{
                start: 48, end: 55}),
                frameRate: this.frameRate,
                repeat: -1
        });

        this.anims.create({
            key: 'walk-up',
            frames: this.anims.generateFrameNumbers('player',{
                start: 40, end: 47}),
                frameRate: this.frameRate,
                repeat: -1
        });

        this.anims.create({
            key: 'walk-left',
            frames: this.anims.generateFrameNumbers('player',{
                start: 56, end: 63}),
                frameRate: this.frameRate,
                repeat: -1
        });

        this.anims.create({
            key: 'walk-down',
            frames: this.anims.generateFrameNumbers('player',{
                start: 32, end: 39}),
                frameRate: this.frameRate,
                repeat: -1
        });
    }
}