import {Scene} from "phaser";
import { CONFIG } from "../config";
import Player from "../entities/Player";
import Touch from "../entities/Touch";
import Fazenda from "./fazenda";
import HUD from "../entities/hud";

export default class Casa extends Scene{

    /**@type {Phaser.Tilemaps.Tilemap} */
    map;
    cena = 0;

    layers = {};

    /**@type {Player} */
    player;
    touch;

    /**@type {Phaser.Physics.Arcade.Group} */
    groupObjects;

    beterraba = 0;
    cenoura = 0;
    tomate = 0;
    laranja = 0;
    sucoBet = 0;
    sucoCen = 0;
    sucoTom = 0;
    sucoLar = 0;
    dinheiro = 0;

    venda = true;

    hud;


    constructor(){
        super('Casa');
    }  

    create(){
        this.createMap();
        this.createLayers();
        this.createPlayer();
        this.createObjects();
        this.createColliders();
        this.createCamera();
        this.createHud();
        
    }

    createPlayer(){

        this.touch = new Touch(this, 35*16, 12*16);
        this.player = new Player(this, 135, 247, this.touch, false, false);
        this.player.setDepth(3);

        
    }

    createObjects(name){
        //criar um grupo para os objetos

        //criando sprites para cada objeto que vier da camada de objetos do tiled
        //Parametros: nome da camada no tiles, propriedade de seleção
        this.groupObjects = this.physics.add.group();

        const objects = this.map.createFromObjects("Objetos", {
            name: name,
            //qual imagem sera carregada no sprite (se houver)
            //key:"player"
        });



        //Tornando todos os objetos, sprites com physics (que possuem body)
        this.physics.world.enable(objects);


        for(let i = 0; i < objects.length; i++){
            //pegando o objeto atual
            const obj = objects[i];
            //pegando as informações do Objeto definidas no Tiled
            const prop = this.map.objects[0].objects[i];

            obj.setDepth(this.layers.length+1);
            obj.setVisible(false);
            obj.body.immovable = true;

            this.groupObjects.add(obj);

            // console.log(prop);
        }
    }


    createMap(){
        this.map = this.make.tilemap({
            key: 'tilemap_casa',
            tileWidth: CONFIG.TILE_SIZE,    
            tileHeight: CONFIG.TILE_SIZE
        });

        //fazendo a correspondencia entre as imagens usadas no tiled e as criadas pelo phaser

        //addTilesetImage(nome da imagem no tiled, nome da imagem carregada no phaser)
        this.map.addTilesetImage('tiles_casa', 'tiles_fazenda');
    }

    createLayers(){
        //pegando tilesets (usar nomes dados no tiled)
        const tilesFazenda = this.map.getTileset('tiles_casa');

        const layerNames = this.map.getTileLayerNames();

        for (let i = 0; i < layerNames.length; i++){
            const name = layerNames[i];

            this.layers[name] = this.map.createLayer(name, [tilesFazenda], 0, 0);
            //definindo a profundidade de cada camada
            this.layers[name].setDepth(i);

            //verificando se o layer possui colisão
            if(name.endsWith('collision')){
                this.layers[name].setCollisionByProperty({collide: true});


                if ( CONFIG.DEBUG_COLLISION ) {
                    
                    const debugGraphics = this.add.graphics().setAlpha(0.75).setDepth(i);
                    this.layers[name].renderDebug(debugGraphics, {
                        tileColor: null, // Color of non-colliding tiles
                        collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
                        faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
                    });
                }
            }
        }

        //console.log(this.layers);
        // console.log(this.map.getTileLayerNames());
    }

    createCamera(){
        const mapWidth = this.map.width * CONFIG.TILE_SIZE;
        const mapHeight = this.map.height * CONFIG.TILE_SIZE;

        this.cameras.main.setBounds(0, 0, mapWidth, mapHeight);
        this.cameras.main.startFollow(this.player);
    }

    createHud(){
        this.hud = new HUD(this,  this.cameras.main.x-10, -10);
    }

    createColliders(){
        //diferença COLLIDER X OVERLAP
        //COLLIDER: colide e impede a passagem
        //OVERLAP: detecta a sobreposição dos elementos, não impede a passagem

        //criando colisão entre o player e as camadas de colisão do tiled
        const layerNames = this.map.getTileLayerNames();
        for (let i = 0; i < layerNames.length; i++){
            const name = layerNames[i];

            if(name.endsWith('collision')){
                this.physics.add.collider(this.player, this.layers[name]);

            }
        }  
        
        
        //criar colisão entre o a "mãozinha" Player (Touch) e os objetos da camada de Objetos
        //objetos da camada de Objetos
        //chama a função this.handleTouch toda vez que o this.touch entrar em contato com um objeto do this.groupObjects
        this.physics.add.overlap(this.touch, this.groupObjects, this.handleTouch, undefined, this);
    }

    handleTouch(touch, object){

        //ja realizou o primeiro toque, sai
        if(this.isTouching && this.player.isAction){
            //console.log(1);
            return;
        }

        //esta tocando mas soltou o espaço (para de tocar)
        if(this.isTouching && !this.player.isAction){
            this.isTouching = false;
            //console.log(2);
            return;
        }

        //acabou de apertar o espaço pela primeira vez e ainda não iniciou o toque
        if(this.player.isAction){
            this.isTouching = true;
            //console.log(object);

            //animação da arvore
            if(object.name == "sair"){
                this.venda = true;
                this.scene.sleep('Casa');
                this.scene.run('Fazenda');
                
            }


            //fazendo suco
            switch (object.name) {
                case "beterraba":
                    this.sucoBet = this.beterraba;
                    this.hud.sucoBet = this.beterraba;
                    this.beterraba = 0;
                    this.hud.beterraba = this.beterraba;
                    console.log("beterraba " + this.beterraba);
                    console.log("sucoBet " + this.sucoBet);
                    break;
                
                case "cenoura":
                    this.sucoCen = this.cenoura;
                    this.hud.sucoCen = this.sucoCen;
                    this.cenoura = 0;
                    this.hud.cenoura = this.cenoura;
                    console.log("cenoura " + this.cenoura);
                    console.log("sucoCen " + this.sucoCen);
                    break;
                
                case "tomate":
                    this.sucoTom = this.tomate;
                    this.hud.sucoTom = this.sucoTom;
                    this.tomate = 0;
                    this.hud.tomate = this.tomate;
                    console.log("tomate " + this.tomate);
                    console.log("sucoTom " + this.sucoTom);
                    break;
                
                case "laranja":
                    this.sucoLar = this.laranja;
                    this.hud.sucoLar = this.sucoLar;
                    this.laranja = 0;
                    this.hud.laranja = this.laranja
                    console.log("laranja " + this.laranja);
                    console.log("sucoLar " + this.sucoLar);
                    break;
            }

            //venda 
            if(object.name == "vender"){
                this.dinheiro = this.dinheiro + this.beterraba + this.cenoura +
                this.tomate + this.laranja + (this.sucoBet*2) + (this.sucoCen*2) +
                (this.sucoTom*2) + (this.sucoLar*2);

                this.beterraba = 0;
                this.cenoura = 0;
                this.tomate = 0;
                this.laranja = 0;
                this.sucoBet = 0;
                this.sucoCen = 0;
                this.sucoTom = 0;
                this.sucoLar = 0;

                this.hud.beterraba = this.beterraba;
                this.hud.tomate = this.tomate;
                this.hud.laranja = this.laranja;
                this.hud.cenoura = this.cenoura;
                this.hud.sucoBet = this.sucoBet;
                this.hud.sucoCen = this.sucoCen;
                this.hud.sucoTom = this.sucoTom;
                this.hud.sucoLar = this.sucoLar;
                this.hud.dinheiro = this.dinheiro;

                
            }

            
            
        }

        //atualizar o hud da cena
        if(object.name == "atualizar" && this.venda){

            let fazendaBeterraba = this.scene.get('Fazenda').beterraba;
            let fazendaCenoura = this.scene.get('Fazenda').cenoura;
            let fazendatomate = this.scene.get('Fazenda').tomate;
            let fazendalaranja = this.scene.get('Fazenda').laranja;

            fazendaBeterraba > this.beterraba ? this.beterraba = fazendaBeterraba : this.beterraba+0;
            fazendaCenoura > this.cenoura ? this.cenoura = fazendaCenoura : this.cenoura+0;
            fazendatomate > this.tomate ? this.tomate = fazendatomate : this.tomate+0; 
            fazendalaranja > this.laranja ? this.laranja = fazendalaranja : this.laranja+0; 

            this.hud.beterraba = this.beterraba;
            this.hud.tomate = this.tomate;
            this.hud.laranja = this.laranja;
            this.hud.cenoura = this.cenoura;
            this.hud.sucoBet = this.sucoBet;
            this.hud.sucoCen = this.sucoCen;
            this.hud.sucoTom = this.sucoTom;
            this.hud.sucoLar = this.sucoLar;
            this.hud.dinheiro = this.dinheiro;
            
            this.venda = false;
            
        }
    }
}