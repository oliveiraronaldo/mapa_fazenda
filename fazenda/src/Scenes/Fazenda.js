import {Scene} from "phaser";
import { CONFIG } from "../config";
import Player from "../entities/Player";
import Touch from "../entities/Touch";

export default class Fazenda extends Scene{

    /**@type {Phaser.Tilemaps.Tilemap} */
    map;

    layers = {};

    /**@type {Player} */
    player;
    touch;

    constructor(){
        super('Fazenda');
    }   

    preload() {
        this.load.tilemapTiledJSON('tilemap_fazenda', './fazenda.tmj');
        this.load.image('tiles_fazenda', './mapas/tiles/geral.png')
        this.load.spritesheet('player', './mapas/tiles/player.png', {
            frameWidth: 48,
            frameHeight: 48
        });
    }

    create(){
        this.createMap();
        this.createLayers();
        this.createPlayer();
        this.createCamera();
        this.createColliders();
    }

    createPlayer(){

        this.touch = new Touch(this, 35*16, 12*16);
        this.player = new Player(this, 35*16, 12*16, this.touch);
        this.player.setDepth(3);

        
    }


    createMap(){
        this.map = this.make.tilemap({
            key: 'tilemap_fazenda',
            tileWidth: CONFIG.TILE_SIZE,    
            tileHeight: CONFIG.TILE_SIZE
        });

        //fazendo a correspondencia entre as imagens usadas no tiled e as criadas pelo phaser

        //addTilesetImage(nome da imagem no tiled, nome da imagem carregada no phaser)
        this.map.addTilesetImage('tiles_fazenda', 'tiles_fazenda');
    }

    createLayers(){
        //pegando tilesets (usar nomes dados no tiled)
        const tilesFazenda = this.map.getTileset('tiles_fazenda');

        const layerNames = this.map.getTileLayerNames();

        for (let i = 0; i < layerNames.length; i++){
            const name = layerNames[i];

            this.layers[name] = this.map.createLayer(name, [tilesFazenda], 0, 0);
            //definindo a profundidade de cada camada
            this.layers[name].setDepth(i);

            //verificando se o layer possui colisão
            if(name.endsWith('collision')){
                this.layers[name].setCollisionByProperty({collide: true});
                // console.log(getTileProperties(4));

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
        // this.physics.add.overlap(this.touch, this.groupObjects, this.handleTouch, undefined, this);
    }
}