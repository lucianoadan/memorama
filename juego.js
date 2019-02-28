
class Juego
{
	constructor(nivel, vidas, errores,tablero) {
	   	
	   	this.nivel 		= nivel;
	   	this.vidas 		= vidas;
	   	this.errores 	= errores;
	   	this.tablero 	= tablero;
	    this.intentos 	= this.getIntentos();
	    this.gui 		= new GUI(this);

	    this.gui.log();
	}

	clicked(id){
		console.log(id);
	}

	// el cáculo puede variar con el nivel
	getIntentos(){
		return Math.ceil(this.tablero.filas * this.tablero.columnas/3) - this.errores;
	}

}

$(document).ready(function(){
	// vidas, nivel, tablero, intentos,... puden ser serializados,
	// almacenados y recuperados 
	let nivel = 1;
	let vidas = 3;
	let errores = 0;

	let tablero = new Tablero(nivel);
	let juego = new Juego(nivel, vidas, errores, tablero);
});

