
export default class Plantacao extends Phaser.Physics.Arcade.Sprite{
    colheita = false;
    stagio;
    plantado = false;
    constructor(scene, x, y, fruta, regada){
        super(scene, x, y, 'plantacao');

        this.fruta = fruta;
        this.regada = regada;
        
        scene.add.existing(this);   //criando a imagem que o jogador vê
        scene.physics.add.existing(this);   //criando o body da fisica

        this.init();
    }

    init(){
        this.setTexture('plantacao');

        this.setOrigin(0.5, 0.5);

        this.body.setSize(12,12);
        this.body.immovable = true;

        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
        
    }

    update(){

        if(this.fruta == "tomate"){
            //acabou de ser plantada
            if(!this.plantado){
                this.setFrame(632);
                this.stagio = 1;
            }

            //regada pela primeira vez
            if(this.regada && this.stagio == 1){
                this.plantado = true;
                setTimeout(() => {
                    // this.setTexture('plantacao');
                    this.setFrame(633);
                    this.stagio = 2;
                    this.regada = false;

                }, 60000);
            }

            //regada pela segunda vez
            if(this.regada && this.stagio == 2){
                this.plantado = true;
                setTimeout(() => {
                    // this.setTexture('plantacao');
                    this.setFrame(634);
                    this.stagio = 3;
                    this.regada = false;

                }, 60000);
            }

            //regada pela terceira vez
            if(this.regada && this.stagio == 3){
                this.plantado = true;
                setTimeout(() => {
                    // this.setTexture('plantacao');
                    this.setFrame(635);
                    this.stagio = 4;
                    this.regada = false;
                    this.colheita = true;

                }, 60000);
            }

        }

        if(this.fruta == "cenoura"){

            //acabou de ser plantada
            if(!this.plantado){
                this.setFrame(584);
                this.stagio = 1;
            }

            //regada pela primeira vez
            if(this.regada && this.stagio == 1){
                this.plantado = true;
                setTimeout(() => {
                    // this.setTexture('plantacao');
                    this.setFrame(585);
                    this.stagio = 2;
                    this.regada = false;

                }, 60000);
            }

            //regada pela segunda vez
            if(this.regada && this.stagio == 2){
                this.plantado = true;
                setTimeout(() => {
                    // this.setTexture('plantacao');
                    this.setFrame(586);
                    this.stagio = 3;
                    this.regada = false;

                }, 60000);
            }

            //regada pela terceira vez
            if(this.regada && this.stagio == 3){
                this.plantado = true;
                setTimeout(() => {
                    // this.setTexture('plantacao');
                    this.setFrame(587);
                    this.stagio = 4;
                    this.regada = false;
                    this.colheita = true;

                }, 60000);
            }
        };

        if(this.fruta == "beterraba"){

            if(!this.plantado){
                this.setFrame(824);
                this.stagio = 1;
            }

            //regada pela primeira vez
            if(this.regada && this.stagio == 1){
                this.plantado = true;
                setTimeout(() => {
                    // this.setTexture('plantacao');
                    this.setFrame(825);
                    this.stagio = 2;
                    this.regada = false;

                }, 60000);
            }

            //regada pela segunda vez
            if(this.regada && this.stagio == 2){
                this.plantado = true;
                setTimeout(() => {
                    // this.setTexture('plantacao');
                    this.setFrame(826);
                    this.stagio = 3;
                    this.regada = false;

                }, 60000);
            }

            //regada pela terceira vez
            if(this.regada && this.stagio == 3){
                this.plantado = true;
                setTimeout(() => {
                    // this.setTexture('plantacao');
                    this.setFrame(827);
                    this.stagio = 4;
                    this.regada = false;
                    this.colheita = true;

                }, 60000);
            }
            
        };
        
    }
}


