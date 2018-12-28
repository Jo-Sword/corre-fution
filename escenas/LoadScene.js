import { JO } from "../JO.js";
import MenuScene from "./MenuScene.js";
export default class LoadScene extends Phaser.Scene{
    constructor(){
        super({key: JO.SCENES.LOAD})
    }

    preload(){
        //Cargamos todos los assets
        this.load.path = './assets/';
        this.load.image('bg', 'background.png');
        this.load.image('titulo', 'titulo.png');
        this.load.image('discord', 'discord.png');
        this.load.spritesheet('puntero', 'puntero.png', {frameWidth: 45, frameHeight: 45});
        this.load.image("tileset", "tileset.png");
        this.load.spritesheet('pj', 'fution.png', {frameWidth: 32, frameHeight: 32});
        this.load.tilemapTiledJSON("mapa", "mapa.json");
        // Cargando...
        let loadingBarBG = this.add.graphics({
            fillStyle: {
                color: 0x333333 //Blanco hexadecimal
            }
        })
        loadingBarBG.fillRect(0, this.game.renderer.height/2-5, this.game.renderer.width, 60)
        let loadingBar = this.add.graphics({
            fillStyle: {
                color: 0xffffff //Blanco hexadecimal
            }
        })
        this.cargando = this.add.text(this.game.renderer.width/2-60,this.game.renderer.height/2-50, "Cargando...", { fontSize: '24px', fontFamiliy: 'Calibri, Arial'});
        
        this.load.on("progress", (percent) => {
            loadingBar.fillRect(5, this.game.renderer.height/2, this.game.renderer.width * percent-10, 50);
            console.log(percent);
        })
    }

    create(){   
        // Fade Out de 0.25 segundos
        this.cameras.main.fade(250); 

        //Se carga la siguiente escena luego de 0.25 segundos (Cuando termina el fade)
	    this.time.delayedCall(250, function() {
            this.scene.add(JO.SCENES.MENU, MenuScene, false);
            this.scene.start(JO.SCENES.MENU, "Load: Menú! Ve.");
        }, [], this);
    }      
}