
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

		let that = this;

		let ficha = $(".juego > .figura#cell_"+id);

		//Verifico si esa es 'azul'
		if(this.tablero.fichas[id].selected){
			//console.log(`Ficha con id ${id} es azul`);
			ficha.addClass("activa");

			// no repito audio
			if(this.tablero.fichas[id].clicked != true){
				this.audio = new Audio('ok.mp3');
				this.audio.play();

				this.tablero.fichas[id].clicked = true;
				this.aciertos++;
			}
		}else{
			//console.log(`Ficha con id ${id} es roja`);
			ficha.addClass("error");

			// bliking
			$(ficha).fadeOut(500);
			$(ficha).fadeIn(500);

			// no repito audio
			if(this.tablero.fichas[id].clicked != true){
				this.audio = new Audio('fail_short.mp3');
				this.audio.play();

				this.tablero.fichas[id].clicked = true;
				this.errores++;
			}
		}	

		this.gui.updateCounterVidas(this.vidas);
		this.gui.updateCounterIntentos(this.getIntentos());

		if($(".activa").length + this.errores >= this.tablero.acertables)
		{

			this.jugando = false;
			 
			// Si se aciertan todas ...
			if(this.aciertos == this.tablero.acertables){
			 
				/*
				swal({
				  title: "Bien Hecho!",
				  text: "Haz Acertado todo!",
				  icon: "success",
				  button: "siguiente nivel!",
				});
				*/
				this.gui.showMensajeBlinking("Bien Hecho!");

				// timeout para evitar superposición de sonidos	
				setTimeout(function(){
					that.audio = new Audio('exito.mp3');
					that.audio.play();
				}, 700);
				
				setTimeout(function(){
					that.nivel++;
					that.gui.showLevel(that.nivel);
					that.renovar();
				}, 2000);
				return;
			}
			else{
				if (this.getIntentos()==0)
				{
					/*
					swal({
						title: "Haz fallado!",
						text: "No acertaste!",
						icon: "error",
						button: "Probar otra vez!",
					});
					*/
					this.gui.showMensajeBlinking("Perdiste una vida");
					this.gui.mostrarAzules();
					this.vidas--;
					this.errores = 0;
					
					this.gui.updateCounterVidas(vidas,true);

					// timeout para evitar superposición de sonidos	
					setTimeout(function(){
						that.gui.updateCounterVidas(vidas);
						that.audio = new Audio('roto.mp3');
						that.audio.play();
					}, 500);

					// timeout para evitar superposición de sonidos	
					setTimeout(function(){
						that.audio = new Audio('fail.mp3');
						that.audio.play();
					}, 1500);

					this.gui.updateCounterVidas(vidas);
					console.log('Vidas: '+this.vidas);

					if (that.vidas != 0){
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

			if (this.vidas == 0){
				// muestro roto el último corazón
				this.gui.updateCounterVidas(1,true);

				console.log('Perdiste');
				this.gui.showMensajeBlinking("Perdiste!");
				this.jugando = false;
			}
			
		}

		this.gui.log();
		
	} // end func


	// Podría ser funcion del nivel
	getIntentos(){
		return Math.ceil(this.tablero.filas * this.tablero.columnas/3) - this.errores;
	}

	renovar(){
		this.aciertos = 0;
		this.errores = 0;
		this.tablero = new Tablero(this.nivel);
		this.gui = new GUI(this);
		setTimeout(()=> {this.gui.ocultarAzules();},400);
		this.jugando=true;
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

