var fution;
var dir = "x";
var cursors;
var f_dir = "down";
var ejecutando = false;
var puntos = 0;
var iniciado = false;
var perdiste = false;
var ganaste = false;
import { JO } from "../JO.js";

export default class JuegoScene extends Phaser.Scene{
    constructor() {
        super({key: JO.SCENES.GAME})
    }

    init(data){
        console.log(data);
        console.log("Juego: He iniciado.");
    }
    create(){
        /* Activa la depuración física para mostrar el hitbox del jugador.
		this.physics.world.createDebugGraphic();*/
        // Colocando los tiles del suelo
        const map = this.make.tilemap({ key: "mapa" });
        const tileset = map.addTilesetImage("tileset", "tileset");

        const groundlayer = map.createStaticLayer("ground", tileset, 0, 0);
        const colisionlayer = map.createStaticLayer("colision", tileset, 0, 0);
        const portal = map.createStaticLayer("portal", tileset, 0, 0);
        const worldLayer = map.createStaticLayer("tuberia", tileset, 0, 0);
        const monedas = map.createDynamicLayer('monedas', tileset, 0, 0);
        
        groundlayer.setCollisionByExclusion([-1]);
        colisionlayer.setCollisionByProperty({ collides: true });
        portal.setCollisionByProperty({ collides: true });
        monedas.setCollisionByProperty({ moneda: true });
        
        // HUD
        // Texto que tiene una posición "fija" en la pantalla
		var puntuacion = this.add.text(this.game.renderer.width/2-18*3, 0, "Jo's: 0", {
            font: "18px monospace",
            fill: "#ffffff",
            padding: { x: 20, y: 10 },
        }).setScrollFactor(0).setDepth(30);// La profundidad(depth) el mayor irá arriba del menor.

        const spawn = map.findObject("objetos", obj => obj.name === "spawn");
        // Crea un sprite con la física habilitada a través del sistema de física. La imagen utilizada para el sprite tiene espacio vacío en su canvas, por lo que estoy usando setSize y setOffset para controlar el tamaño del cuerpo del jugador (la colisión sea exactamente del tamaño del dibjo y no del canvas).
        fution = this.physics.add
            .sprite(spawn.x-3, spawn.y, "pj")
            .setSize(18, 22)
            .setOrigin(0)
            .setOffset(7, 5);
        fution.setInteractive();
        fution.on('pointerdown', () => {
            alert("Clic a PJ");
        });
        // Perderá al chocar con la capa de colision
        this.physics.add.collider(fution, colisionlayer, gameover);
        
        // El jugador ganará al chocar con la capa de portal.
        this.physics.add.collider(fution, portal, win);
        
        // Obtendrá puntos al colisionar con "monedas"
        this.physics.add.collider(fution, monedas, moneda);
        //this.physics.add.overlap(fution, monedas, moneda);
        function moneda(sprite, tile){
            if(perdiste){return false}
            monedas.removeTileAt(tile.x, tile.y);
            puntos+= 5;
            console.log(puntos);
            puntuacion.text = "Jo's: "+puntos;
        }
        //this.physics.add.overlap(fution, colisionlayer);
        // Camara
        const camera = this.cameras.main;
        camera.startFollow(fution);
        camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        
        this.z = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        this.x = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
        // HUD START GAME
        let start = this.add.graphics();
        start.fillStyle(0x150425,.9999);
        start.fillRect(this.game.renderer.width/2, 0, this.game.renderer.width, this.game.renderer.height);
        const starting_text = this.add.text(this.game.renderer.width-440, 100, "¡Encuentra el portal!\n\n Creado por: Jo-Sword", {
            font: "26px monospace",
            fill: "#ffffff",
            align: 'center',
            padding: {x: 20, y:20},
        }).setDepth(31);
        const start_text = this.add.text(this.game.renderer.width/2, this.game.renderer.height/3, "Presiona Z ó X para iniciar el juego \n\n Controles: \n\n Z: Izquierda/Arriba \n\n X: Derecha/Abajo", {
            font: "22px monospace",
            fill: "#ffffff",
            align: 'center',
            padding: { x: 20, y: 10 },
        }).setDepth(30);// La profundidad(depth) el mayor irá arriba del menor.


        // HUD GAME OVER
        let go = this.add.graphics();
        go.setVisible(false);
        go.fillStyle(0x8e1414, 1);
        go.fillRect(0, 0, this.game.renderer.width, this.game.renderer.height+500);
        const go_text = this.add.text(this.game.renderer.width/5, this.game.renderer.height/2, "¡Perdiste! \n presiona Z ó X para reiniciar el juego.", {
            font: "26px monospace",
            fill: "#ffffff",
            align: 'center',
            padding: { x: 20, y: 10 },
        }).setDepth(30);// La profundidad(depth) el mayor irá arriba del menor.
        go_text.setVisible(false);
        

        // HUD WIN
        let win_bg = this.add.graphics();
        win_bg.setVisible(false);
        win_bg.fillStyle(0x333333, 1);
        win_bg.fillRect(0, 0, this.game.renderer.width+500, this.game.renderer.height+500);
        const win_text = this.add.text(26*10, this.game.renderer.height/2-100, "¡Felicidades! \neres una persona increíble, has ganado.",{
            font: "26px monospace",
            fill: "#ffffff",
            padding: {x: 20, y:10},
        }).setDepth(30);
        win_text.setVisible(false);
        const firma = this.add.text(16*15, this.game.renderer.height-60, "Creado en la RandomJam#2 de TutoFacil \npor: Jo-Sword de Fution Games", {
            font: "16px monospace",
            fill: "#eeeeee",
            padding: {x:10, y:10},
        }).setDepth(30);
        firma.setVisible(false);
        const win_opciones = this.add.text(this.game.renderer.width-200, this.game.renderer.height-60, "    Muchas gracias por jugar.\nPresiona Z para reiniciar el juego.", {
            font: "16px monospace",
            fill: "#eeeeee",
            padding: {x:10, y:10},
        }).setDepth(30);
        win_opciones.setVisible(false);
        
        // El boton Z hace que el jugador se mueva hacia la Izquierda/Arriba
        // El boton X hace que el jugador se mueva hacia la Derecha/Abajo

        // Si la direccion es izquierda y toca Z cambia a arriba, si es arriba y toca Z cambia a izquierda
        // Si es derecha y toca X cambia a abajo, si es abajo y toca X cambia a derecha.

        // Si es (X) abajo y toca Z es izquierda.
        // Si es (Z) izquierda y toca X es abajo.
        // Si es (X) derecha y toca Z es arriba.
        // Si es (Z) arriba y toca X es derecha.
        console.log('camara '+camera.rotation);
        const ajustar = (max) => {
            if(perdiste){camera.setAngle(0);camera.rotation = 0;return false;}
            this.tween = this.tweens.add({
                targets: camera,
                duration: 150,
                props: {
                    rotation: {
                        value: max
                    }
                },
                ease: 'linear',
            })
        }
        this.input.keyboard.on("keyup_Z", () => {
            if(!iniciado){
                start_text.setVisible(false);
                starting_text.setVisible(false);
                start.setVisible(false);

                iniciado = true;

                camera.setZoom(2);
                
                f_dir = "down";
                dir = "x";
                return false;
            }
            if(perdiste){
                perdiste = false;
                iniciado = false;

                this.scene.stop();
                this.scene.restart();
                
                start_text.setVisible(true);
                starting_text.setVisible(true);
                start.setVisible(true);
                return false;
            }
            if(dir == "y"){
                if(f_dir == "left"){
                    f_dir = "up";
                    dir = "y";
                    ajustar(0);
                    fution.setSize(18, 22).setOffset(7, 5);
                }else if(f_dir == "up"){
                    f_dir = "left";
                    dir = "y";
                    ajustar(0.5);
                    fution.setSize(15, 22).setOffset(10, 5);
                }
            }else{
                if(f_dir == "down"){
                    f_dir = "left";
                    dir = "y";
                    ajustar(0.5);
                    fution.setSize(15, 22).setOffset(10, 5);
                }else if(f_dir == "right"){
                    f_dir = "up";
                    dir = "y";
                    ajustar(0);
                    fution.setSize(18, 22).setOffset(7, 5);
                }
            }
            console.log(f_dir+' | '+dir);
        });

        this.input.keyboard.on("keyup_X", () => {
            if(!iniciado){
                start_text.setVisible(false);
                starting_text.setVisible(false);
                start.setVisible(false);

                iniciado = true;

                camera.setZoom(2);

                f_dir = "down";
                dir = "x";
                return false;
            }
            if(perdiste){
                perdiste = false;
                iniciado = false;
                
                this.scene.stop();
                this.scene.restart();

                start_text.setVisible(true);
                starting_text.setVisible(true);
                start.setVisible(true);
                return false;
            }
            if(dir == "x"){
                if(f_dir == "right"){
                    f_dir = "down";
                    dir = "x";
                    ajustar(0);
                    fution.setSize(18, 22).setOffset(7, 5);
                }else if(f_dir == "down"){
                    f_dir = "right";
                    dir = "x";
                    ajustar(-0.5);
                    fution.setSize(15, 22).setOffset(10, 5);
                }
            }else{
                if(f_dir == "left"){
                    f_dir = "down";
                    dir = "x";
                    ajustar(0);
                    fution.setSize(18, 22).setOffset(7, 5);
                }else if(f_dir == "up"){
                    f_dir = "right";
                    dir = "x";
                    ajustar(-0.5);
                    fution.setSize(15, 22).setOffset(10, 5);
                }
            }
            console.log(f_dir+' | '+dir);
        });
        function gameover() {
            if(perdiste){return false}
            camera.shake(200);
            camera.setZoom(1);
            go.setVisible(true);
            go_text.setVisible(true);
            perdiste = true;
            return false;
        }

        function win() {
            if(perdiste){return false}
            if(ganaste){return false}
            if(!iniciado){return false}
            if(puntos == 100){
                win_text.text = "     ¡Super mega híper felicidades! \n Ganaste y conseguiste todas las Jo's en el juego,\n eres extremadamente agil. \n\n Obtienes el titulo de: \"Flechita Veloz\" ";
            }else if(puntos >= 50 && puntos < 100){
                win_text.text = "     ¡Felicidades! \nGanaste y conseguiste la mitad de las Jo's en el juego,\n eres alguien agil. \n\nObtienes el titulo de: \"Liebre\" ";
            }else if(puntos < 50){
                win_text.text = "     ¡Felicidades! \n eres una persona increíble, has ganado el juego.";
            }
            ganaste = true;
            camera.setZoom(1);
            win_bg.setVisible(true);
            win_text.setVisible(true);
            firma.setVisible(true);
            win_opciones.setVisible(true);
            console.log("Ganaste");
            return false;
        }
        /*this.time.delayedCall(250, function() {
            alert("XD");
        }, [], this);*/
    }
    update(time, delta){
        const speed = 150;
        const prevVelocity = fution.body.velocity.clone();
    
        // Detiene cualquier movimiento previo del último cuadro.
        fution.body.setVelocity(0);
        if(iniciado && !perdiste){
            if(f_dir == "left"){fution.body.setVelocityX(-speed)}
            if(f_dir == "right"){fution.body.setVelocityX(speed)}
            if(f_dir == "up"){fution.body.setVelocityY(-speed)}
            if(f_dir == "down"){fution.body.setVelocityY(speed)}
        }
        if(perdiste && this.cameras.main.rotation != 0){this.cameras.main.setAngle(0)}
        
        // Según la dirección del personaje se coloca el frame especifico para él
        if(iniciado && !perdiste){
            if (f_dir == "left") {
                fution.setTexture("pj", "1");
            } else if (f_dir == "right") {
                fution.setTexture("pj", "3");
            } else if (f_dir == "up") {
                fution.setTexture("pj", "2");
            } else if (f_dir == "down") {
                fution.setTexture("pj", "0");
            }
        }
    }
}