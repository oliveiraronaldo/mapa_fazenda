import {AUTO, Scene} from "phaser";
import { CONFIG } from "../config";
import Player from "../entities/Player";
import Touch from "../entities/Touch";
import Arvores from "../entities/Arvores";
import Vaca from "../entities/Vaca";
import Plantacao from "../entities/Plantacao";
import HUD from "../entities/hud";

export default class Fazenda extends Scene{

    /**@type {Phaser.Tilemaps.Tilemap} */
    map;

    layers = {};

    /**@type {Player} */
    player;
    touch;
    cena = 0;
    hud;

    /**@type {Phaser.Physics.Arcade.Group} */
    groupObjects;

    /**@type {Phaser.Physics.Arcade.Group} */
    GroupArvores;

    /**@type {Phaser.Physics.Arcade.Group} */
    GroupPlant;

    arvores = [];
    vacas = [];


    plantacao;

    semente;

    isTouching = false;

    regando = false;
    colhendo = false;
    atualizarDinheiro = false;


    beterraba = 0;
    cenoura = 0;
    tomate = 0;
    laranja = 0;
    sucoBet = 0;
    sucoCen = 0;
    sucoTom = 0;
    sucoLar = 0;
    dinheiro = 0;



    constructor(){
        super('Fazenda');
    }  

    preload() {
        this.load.tilemapTiledJSON('tilemap_fazenda', './fazenda.tmj');
        this.load.tilemapTiledJSON('tilemap_casa', './casa.tmj');
        this.load.image('tiles_fazenda', './mapas/tiles/geral.png')
        this.load.spritesheet('player', './mapas/tiles/player.png', {
            frameWidth: 48,
            frameHeight: 48
        });

        this.load.spritesheet('arvore', './mapas/tiles/arvore_laranjas_anim.png', {
            frameWidth: 48,
            frameHeight: 48
        });

        this.load.spritesheet('arvore_vazia', './mapas/tiles/arvore_anim.png', {
            frameWidth: 48,
            frameHeight: 48
        });

        this.load.spritesheet('vaca', './mapas/tiles/vacas_anim.png', {
            frameWidth: 32,
            frameHeight: 32
        });

        this.load.spritesheet('plantacao', './mapas/tiles/geral.png', {
            frameWidth: 16,
            frameHeight: 16
        });

        this.load.atlas('hud', './mapas/tiles/hud.png', './mapas/hudFazenda.json');
        this.load.atlas('hudContainer', './hudContainer.png', './hudContainer.json');
    }

    create(){
        this.createMapFazenda();
        this.createLayersFazenda();
        this.createPlayer();
        this.createTree();
        this.createCow();
        this.createObjects();
        this.createColliders();
        this.createCamera();
        this.createHud();
    }

    update(){

        this.hud.x = this.cameras.main.scrollX - 10;
        
        

        this.input.keyboard.once('keydown-E', () =>{
            this.regando = true;
        });

        setTimeout(() => {
            this.regando = false;
        }, 1000);
        


        this.input.keyboard.once('keydown-R', () =>{
            this.colhendo = true;
        })

        setTimeout(() => {
            this.colhendo = false;
        }, 1000);



    }
    

    createPlayer(){

        this.touch = new Touch(this, 35*16, 12*16);
        this.player = new Player(this, 35*16, 12*16, this.touch, false, false);
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

    createTree(){

        for(let i = 0; i < this.map.objects[0].objects.length; i++){
            const obj = this.map.objects[0].objects[i];
            if (obj.name.startsWith("arvore")) {
                let name = obj.name;
                this.arvores[name] = new Arvores(this, obj.x+6, obj.y-10, false)
                .setDepth(4);

                
            }
        }

        // const arvore =  this.physics.add.sprite(6*16, 12*16, "arvore", 0);
        // this.arvores.setDepth(4);
    }

    createCow(){
        this.GroupVacas = this.physics.add.group();
    
        this.vacas[0] = new Vaca(this, 288, 224, "araponga",false, 1).setDepth(3);
        this.GroupVacas.add(this.vacas[0]);

        this.vacas[1] = new Vaca(this, 576, 144, "mimosa",false, 2).setDepth(3);
        this.GroupVacas.add(this.vacas[1]);


        
    }


    createMapFazenda(){
        this.map = this.make.tilemap({
            key: 'tilemap_fazenda',
            tileWidth: CONFIG.TILE_SIZE,    
            tileHeight: CONFIG.TILE_SIZE
        });

        //fazendo a correspondencia entre as imagens usadas no tiled e as criadas pelo phaser

        //addTilesetImage(nome da imagem no tiled, nome da imagem carregada no phaser)
        this.map.addTilesetImage('tiles_fazenda', 'tiles_fazenda');
    }

    createLayersFazenda(){
        //pegando tilesets (usar nomes dados no tiled)
        const tilesFazenda = this.map.getTileset('tiles_fazenda');

        const layerNames = this.map.getTileLayerNames();

        for (let i = 0; i < layerNames.length; i++){
            const name = layerNames[i];

            this.layers[name] = this.map.createLayer(name, [tilesFazenda], 0, 0);
            //definindo a profundidade de cada camada
            this.layers[name].setDepth(i);

            //verificando se o layer possui colisão
            if(name.endsWith('collision') || name.endsWith('vaca')){
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
                this.physics.add.collider(this.GroupVacas, this.layers[name]);

            }
            if(name.endsWith('vaca')){
                this.physics.add.collider(this.GroupVacas, this.layers[name]);

            }
        }  


        const obj = this.map.objects[0].objects;
        for(let i = 0; i < obj.length; i++){
            if(obj[i].name.startsWith('arvore')){
                let name = obj[i].name;
                this.physics.add.collider(this.player, this.arvores[name]);
                this.physics.add.collider(this.GroupVacas, this.arvores[name]);

                

            }
            
        }
        

        
        //criar colisão entre o a "mãozinha" Player (Touch) e os objetos da camada de Objetos
        //objetos da camada de Objetos
        //chama a função this.handleTouch toda vez que o this.touch entrar em contato com um objeto do this.groupObjects
        this.physics.add.overlap(this.touch, this.groupObjects, this.handleTouch, undefined, this);
        this.physics.add.overlap(this.touch, this.GroupVacas, this.handleTouchVaca, undefined, this);
        this.GroupPlant = this.physics.add.group();
        this.physics.add.overlap(this.touch, this.GroupPlant, this.handleTouchPlantas, undefined, this);
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
            if(object.name.startsWith('arvore')){
                let name = object.name;
                if (this.arvores[name].anim == false) {
                    this.arvores[name].anim = true;
                    this.laranja += 3;
                    this.hud.laranja  = this.laranja; 

                }
            }

            //entrando na casa
            if(object.name == "casa"){

                this.scene.run('Casa');

                this.scene.sleep('Fazenda');
                this.cena = 1;

                this.atualizarDinheiro = true;

                
            
            }


            //pegando semente
            if(object.name == "beterraba"){
                this.semente = "beterraba"
            }else if(object.name == "tomate"){
                this.semente = "tomate";
            }else if(object.name == "cenoura"){
                this.semente = "cenoura";
            }


            //plantando
            if(this.semente == "beterraba" && object.name == "plantacaoBeterraba"){
                this.plantacao = new Plantacao(this, object.x, object.y-3, "beterraba", false).setDepth(3);
                this.GroupPlant.add(this.plantacao);

            }

            if(this.semente == "tomate" && object.name == "plantacaoTomate"){
                this.plantacao = new Plantacao(this, object.x, object.y-3, "tomate", 0).setDepth(3);
                this.GroupPlant.add(this.plantacao);
            }
            
            if(this.semente == "cenoura" && object.name == "plantacaoCenoura"){
                this.plantacao = new Plantacao(this, object.x, object.y-3, "cenoura", false).setDepth(3);
                this.GroupPlant.add(this.plantacao);
            }

            
            
            
        }
        
        //atualizando o hud da cena
        if(object.name == "atualizar" && this.atualizarDinheiro){

            this.beterraba = this.scene.get('Casa').beterraba;
            this.cenoura = this.scene.get('Casa').cenoura;
            this.tomate = this.scene.get('Casa').tomate;
            this.laranja = this.scene.get('Casa').laranja;
            this.sucoBet = this.scene.get('Casa').sucoBet;
            this.sucoCen = this.scene.get('Casa').sucoCen;
            this.sucoTom = this.scene.get('Casa').sucoTom;
            this.sucoLar = this.scene.get('Casa').sucoLar;
            this.dinheiro = this.scene.get('Casa').dinheiro;
            this.atualizarDinheiro = false;

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

    
    handleTouchPlantas(touch, planta) {

        //regando a planta
        if(planta.regada == false && this.regando){
            this.player.regar = true;
            planta.regada = true;
        }


        //colhendo
        if(planta.fruta == "cenoura"){
            if(planta.colheita && this.colhendo){
                this.player.colher = true;
                planta.destroy();
                this.cenoura+=1;
                this.hud.cenoura = this.cenoura;
            }
        }else if(planta.fruta == "beterraba"){
            if(planta.colheita && this.colhendo){
                this.player.colher = true;
                planta.destroy();
                this.beterraba += 1;
                this.hud.beterraba = this.beterraba;
            }
        }else if(planta.fruta == "tomate"){
            if(planta.colheita && this.colhendo){
                this.player.colher = true;
                planta.destroy();
                this.tomate += 1;
                this.hud.tomate = this.tomate;
            }
        }
        
        
    }
      

    handleTouchVaca(touch, vaca){
        
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

            let name = vaca.name;

            //animação da vaca
            if(vaca.name.startsWith('araponga')){
                for(let i = 0; i < this.vacas.length; i++){
                    if(this.vacas[i].name == name){
                        this.vacas[i].anim = true;
                    }
                }
            }

            if(vaca.name.startsWith('mimosa')){
                for(let i = 0; i < this.vacas.length; i++){
                    if(this.vacas[i].name == name){
                        this.vacas[i].anim = true;
                    }
                }
            }
            
            
        }
    }
}