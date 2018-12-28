import LoadScene from "./escenas/LoadScene.js";
const config = {
	width: 1024,// Tamaño de anchura del canvas
	height: 720,// Tamaño de altura del canvas
	type: Phaser.AUTO,// Modo automático del render Canvas/WebGL
	parent: "contenedor-juego",// El id(#) contenedor del canvas en el html
    pixelArt: true, // Indica al render que se utiliza pixel art.
	backgroundColor: "#18052b", // El color de fondo del juego.
	physics: {// Agregando físicas
		default: "arcade",// Utilizamos la fisica "arcade"
		arcade: {// Agregamos propiedades de arcade
            gravity: { y: 0 },// La gravedad será de 0 porque es un juego top-down
            debug: false
		}
	},
	scene: [
        LoadScene
    ]
};
// Iniciando el juego.
new Phaser.Game(config);