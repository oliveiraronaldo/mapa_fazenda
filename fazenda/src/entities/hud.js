//HUD.js
import Phaser, { Scene } from "phaser";
import { CONFIG } from "../config";
import Fazenda from "../Scenes/fazenda";

export default class HUD extends Phaser.GameObjects.Container{

    /**@type {Phaser.GameObjects.Container} */
    conteudo;

    beterraba = 0;
    cenoura = 0;
    tomate = 0;
    laranja = 0;
    sucoBet = 0;
    sucoCen = 0;
    sucoTom = 0;
    sucoLar = 0;
    dinheiro = 0;

    beterrabaTxt;
    cenouraTxt;
    tomateTxt;
    laranjaTxt;
    sucoBetTxt;
    sucoCenTxt;
    sucoTomTxt;
    sucoLarTxt;
    dinheiroTxt;
    

    constructor(scene, x, y){
        super(scene, x, y);

        scene.add.existing(this); // Colocando o cara na cena

        this.createHud();
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);


        
    }

    


    createHud(){
        console.log('Dialogo')


        this.conteudo = this.add( new Phaser.GameObjects.Container(this.scene));
        this.conteudo.setDepth(10);

        const tile = CONFIG.TILE_SIZE;
        const widthDialog = 175;
        const heightDialog = 2 * tile;

        this.conteudo.add(
            [
                this.scene.add.image(0, 0, 'hudContainer', 'dialog_topleft'),
                this.scene.add.image(16, 0, 'hudContainer', 'dialog_top').setDisplaySize(widthDialog, tile),
                this.scene.add.image(widthDialog+tile, 0, 'hudContainer', 'dialog_topright'),
                this.scene.add.image(0, 16, 'hudContainer', 'dialog_left').setDisplaySize(16, heightDialog),
                this.scene.add.image(16, 16, 'hudContainer', 'dialog_center').setDisplaySize(widthDialog, heightDialog),
                this.scene.add.image(widthDialog+tile, 16, 'hudContainer', 'dialog_right').setDisplaySize(tile, heightDialog),
                this.scene.add.image(0, heightDialog+tile, 'hudContainer', 'dialog_bottomleft'),
                this.scene.add.image(16, heightDialog+tile, 'hudContainer', 'dialog_bottom').setDisplaySize(widthDialog, tile),
                this.scene.add.image(widthDialog+tile, heightDialog+tile, 'hudContainer', 'dialog_bottomright'),
                this.scene.add.image(23, 23, 'hud', 'beterraba.png'),
                this.beterrabaTxt = this.scene.add.text(33, 18, '0'),
                this.scene.add.image(23, 39, 'hud', 'sucoroxo.png'),
                this.sucoBetTxt = this.scene.add.text(33, 34, '0'),
                this.scene.add.image(55, 23, 'hud', 'cenoura.png'),
                this.cenouraTxt = this.scene.add.text(65, 18, '0'),
                this.scene.add.image(55, 39, 'hud', 'sucorosa.png'),
                this.sucoCenTxt = this.scene.add.text(65, 34, '0'),
                this.scene.add.image(87, 23, 'hud', 'tomate.png'),
                this.tomateTxt = this.scene.add.text(97, 18, '0'),
                this.scene.add.image(87, 39, 'hud', 'sucoroxo.png'),
                this.sucoTomTxt= this.scene.add.text(97, 34, '0'),
                this.scene.add.image(119, 23, 'hud', 'laranja.png'),
                this.laranjaTxt = this.scene.add.text(129, 18, '0'),
                this.scene.add.image(119, 39, 'hud', 'sucorosa.png'),
                this.sucoLarTxt = this.scene.add.text(129, 34, '0'),
                this.scene.add.image(155, 33, 'hud', 'coin_16.png').setDisplaySize(16,16),
                this.dinheiroTxt = this.scene.add.text(165, 27, '0')
            ]

        );
        // this.dialog.setPosition(0, this.dialogPositionHide);
        // const style = {
        //     fontFamily: 'Verdana',
        //     fontSize: 11,
        //     color: '#6b5052',
        //     maxLines: 3,
        //     wordWrap: {width: widthDialog}

        // }

        // this.dialogText = this.scene.add.text(tile, tile, 'Meu texto', style);
        // this.dialog.add(this.dialogText);
       
        
    }

    update(){
        this.beterrabaTxt.setText(this.beterraba);
        this.cenouraTxt.setText(this.cenoura);
        this.tomateTxt.setText(this.tomate);
        this.laranjaTxt.setText(this.laranja);
        this.sucoBetTxt.setText(this.sucoBet);
        this.sucoCenTxt.setText(this.sucoCen);
        this.sucoTomTxt.setText(this.sucoTom);
        this.sucoLarTxt.setText(this.sucoLar);
        this.dinheiroTxt.setText(this.dinheiro);

    }

    





}