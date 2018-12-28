import { JO } from "../JO.js";
import JuegoScene from "./JuegoScene.js";
export default class MenuScene extends Phaser.Scene{
    constructor() {
        super({key: JO.SCENES.MENU})
    }

    init(data){
        console.log(data);
        console.log("Menu: Lo capto");
    }

    create(){
        this.bg = this.add.image(0,0, 'bg').setOrigin(0);
        let puntero = this.add.sprite(130, 130, 'puntero');
        puntero.setScale(1.2).setDepth(1);
        this.anims.create({
            key: 'puntero',//nombre de la animación
            frames: this.anims.generateFrameNumbers('puntero', {
                //frames: [0,1,2,3]
                // Ese es un método de colocar los frames específicos pero en spritesheets más ordenados se usa:
                start: 0,//El frame de inicio
                end: 3//El frame de final
            }),
            repeat: -1,//Repetir infinito
            frameRate: 15//El frameRate como el tiempo que dura en ejecutarse el siguiente frame, 24 por defecto.
        });
        puntero.setVisible(false);
        puntero.anims.play("puntero");//nombre de la animación
        
        // Titulo y boton para jugar.
        this.titulo = this.add
            .image(this.game.renderer.width/2+80, this.game.renderer.height/4, 'titulo')
            .setOrigin(0)
            .setDepth(0);
        
        // Boton de Discord
        this.discord = this.add
            .image(this.game.renderer.width/2+50, this.game.renderer.height/4+150, 'discord')
            .setOrigin(0)
            .setDepth(0);
        
        // Botón de jugar
        this.titulo.setInteractive();
        this.titulo.on('pointerup', () => {
            this.sound.stopAll();
            this.scene.add(JO.SCENES.GAME, JuegoScene, false);
            this.scene.start(JO.SCENES.GAME, "Menu: Vamos juego, ¡adelante!");
        });
        this.titulo.on('pointerover', () => {
            puntero.setVisible(true);
            puntero.x = this.titulo.x - puntero.width+10;
            puntero.y = this.titulo.y + puntero.height - 5;
        });
        this.titulo.on('pointerout', () => {
            puntero.setVisible(false);
        });

        // Botón de Discord
        this.discord.setInteractive();
        this.discord.on('pointerup', () => {
            window.open('https://discord.gg/9jydH93', '_blank');
        });
        this.discord.on('pointerover', () => {
            puntero.setVisible(true);
            puntero.x = this.discord.x - puntero.width+10;
            puntero.y = this.discord.y + puntero.height - 5;
        });
        this.discord.on('pointerout', () => {
            puntero.setVisible(false);
        });
    }
}