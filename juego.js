
class Juego
{
	constructor(nivel, vidas, errores, aciertos, tablero)
	{  	
	   	this.jugando	= true;
	   	this.nivel 		= nivel;
	   	this.vidas 		= vidas;
	   	this.errores 	= errores;
	   	this.aciertos	= aciertos;
	   	this.tablero 	= tablero;
	    this.gui 		= new GUI(this);
	    this.audio 		= null;
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
			this.gui.blikingFicha(id);

			// no repito acción
			if(this.tablero.fichas[id].clicked != true){
				this.playAudio('fail_short.mp3');
				this.tablero.fichas[id].clicked = true;
				this.errores++;
			}
		}	

		this.gui.updateCounterVidas(this.vidas);
		this.gui.updateCounterIntentos(this.getIntentos());

		//if(this.tablero.getActivas() + this.errores >= this.tablero.acertables || this.getIntentos() <= 0)
		//{
		 
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
				that.renovar();
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
					}, 2000);
				}else{
					that.gui.showMensaje("");
				}	
			}else{
				setTimeout(()=>{that.jugando=true;},1200);
			}
		}

		// Se pueden jugar mientras existan intentos, con cero vidas.
		if (this.vidas < 0){
			console.log('Perdiste');
			this.gui.showMensajeBlinking("Perdiste!");
			this.jugando = false;
		}
			
		///}

		this.gui.log();
		
	} // end func


	getIntentos(){
		return Math.ceil(Math.sqrt(this.tablero.acertables)) - this.errores;
	}

	// El tiempo para observar el patrón disminuye al aumentar el nivel
	getTiempoParaOcultarAzules(){
		return 400 + Math.ceil(1000/Math.sqrt(this.nivel));
	}

	renovar(){
		this.aciertos = 0;
		this.errores = 0;
		this.tablero = new Tablero(this.nivel);
		this.gui = new GUI(this);
		setTimeout(()=> {
			this.gui.ocultarAzules();
			this.jugando=true;
		}, this.getTiempoParaOcultarAzules());
	}

	levelUp(){
		this.nivel++;
		
		// Regalo vida cada 5 niveles
		if(this.nivel %5 ==0){
			this.vidas++;
			this.gui.updateCounterVidas(this.vidas);
		}

		this.gui.showLevel(this.nivel);
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

