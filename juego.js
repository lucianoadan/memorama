
// tiempo en que la GUI deja de responder, en milisegundos
// es el tiempo mínimo que tengo para ver la renovación del tablero
const responsividad = 350;

class Juego
{
	constructor(nivel, vidas, errores, aciertos, tablero)
	{  	
		this.jugando	= false;
	   	this.nivel 		= nivel;
	   	this.vidas 		= vidas;
	   	this.errores 	= errores;
	   	this.aciertos	= aciertos;
	   	this.tablero 	= tablero;
	    this.gui 		= new GUI(this);
	    this.audio 		= null;

	    let that = this;
	    setTimeout(()=>{that.jugando = true;}, that.gui.getSpinningTime()+2000);
	    
	}

	clicked(id)
	{
		if(!this.jugando)
			return;

		this.jugando = false;

		let that = this;

		//Verifico si esa es 'azul'
		if(this.tablero.fichas[id].selected){
			this.tablero.fichas[id].active = true;
			this.gui.marcarAcierto(id);

			// no repito acción 
			if(this.tablero.fichas[id].clicked != true){
				this.playAudio('ok.mp3');
				this.tablero.fichas[id].clicked = true;
				this.aciertos++; /// 
			}
		}else{
			// bliking
			//this.gui.blinkingFicha(id);
			this.gui.rotarFicha(id);

			// no repito acción
			if(this.tablero.fichas[id].clicked != true){
				this.playAudio('fail_short.mp3');
				this.tablero.fichas[id].clicked = true;
				this.errores++;
			}
		}	

		this.gui.updateCounterVidas(this.vidas);
		this.gui.updateCounterIntentos(this.getIntentos());

		// Si se aciertan todas ...
		if(this.aciertos == this.tablero.acertables)
		{
			this.gui.showMensajeBlinking("Bien Hecho!");

			// timeout para evitar superposición de sonidos	
			setTimeout(function(){
				that.playAudio('exito.mp3');
			}, 700);
			
			setTimeout(function(){
				that.levelUp();
			}, 2000);

			return;
		}else{
			if (this.getIntentos()<=0)
			{
				this.gui.showMensajeBlinking("Perdiste una vida");
				this.gui.mostrarAzules();
				this.errores = 0;
				this.aciertos= 0;
				
				this.gui.flashUltimaVida(this.vidas);
				this.vidas--;

				// timeout para evitar superposición de sonidos	
				setTimeout(function(){
					that.playAudio('roto.mp3');
				}, 500);

				// timeout para evitar superposición de sonidos	
				setTimeout(function(){
					that.playAudio('fail.mp3');
				}, 1500);

				//this.gui.updateCounterVidas(vidas);
				console.log('Vidas: '+this.vidas);

				if (that.vidas >= 0){
					setTimeout(function(){
						that.renovar();
					}, 2000 + 2 * this.gui.getSpinningTime());
				}else{
					that.gui.showMensaje("");
				}	
			}else{
				setTimeout(()=>{that.jugando=true;}, responsividad);
			}
		}

		// Se pueden jugar mientras existan intentos, con cero vidas.
		if (this.vidas < 0){
			console.log('Perdiste');
			this.gui.showMensajeBlinking("Perdiste!");
			this.gui.mostrarAzules();
			this.jugando = false;
		}

		this.gui.log();
		
	} // end func


	getIntentos(){
		return Math.ceil(Math.sqrt(this.tablero.acertables)) - this.errores;
	}

	// El tiempo para observar el patrón disminuye al aumentar el nivel
	getTiempoParaOcultarAzules(){
		return 400 + Math.ceil(600/Math.sqrt(this.nivel)) + this.tablero.filas * this.tablero.columnas * 30 - this.gui.getSpinningTime();
	}

	levelUp(){
		this.nivel++;

		// Regalo vida cada 5 niveles
		if(this.nivel %5 ==0){
			this.vidas++;
			this.gui.updateCounterVidas(this.vidas);
		}

		this.gui.showLevel(this.nivel);
		this.renovar();
	}

	gotoLevel(n){
		this.nivel = n;
		this.gui.showLevel(this.nivel);
		this.renovar();
	}

	renovar(){
		this.aciertos = 0;
		this.errores = 0;
		this.tablero = new Tablero(this.nivel);
		setTimeout(()=> {
			this.gui = new GUI(this); // debe ir acá dentro
			this.gui.ocultarAzules();
			this.jugando=true;
		}, this.getTiempoParaOcultarAzules() + this.gui.getSpinningTime());
	}

	playAudio(file){
		this.audio = new Audio(file);
		this.audio.play();
	}

}

// vidas, nivel, tablero, intentos,... puden ser serializados,
// almacenados y recuperados 
let nivel = 1;
let vidas = 3;
let errores = 0;
let aciertos = 0;
let juego;

$(document).ready(function(){
	let tablero = new Tablero(nivel);
	juego = new Juego(nivel, vidas, errores, aciertos, tablero);
	//console.log(juego);
});

