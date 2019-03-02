const Tfigura = 55;
const vidaChar = ["♡", "♥", "❤","❤️","🖤","💔"];
const intentoChar = ["♖", "⚔","⚡"];

class GUI
{
	constructor(juego)
	{
		this.juego = juego; 
		let that = this;

		// Creo alias
		let c = this.juego.tablero.columnas;
		let r = this.juego.tablero.filas;

		//Borramos todos los elementos del escenario o tablero de juego
		$( ".juego" ).fadeOut( 1000, function()
		{ 
		// al finalizar el metodo desvanecer
		// vaciar los elementos del juego en el escenario o tablero de juego
			$( ".juego" ).empty();
			 
			// Expandir el escenario o tablero de juego para acomodar los circulos
			$( ".micro_container" ).animate({height: ((Tfigura+8)*r)+"px",width: ((Tfigura+8)*c)+"px"},1000, 
			// al finalizar la expansion con amimate()
			// creo las nuevas figuras segun la nueva dimension de la pantalla i nivel de juego
				function()
				{
					for(let i = 0; i < (c * r); i++){
						$( ".juego" ).append(that.crearFigura("circulo", Tfigura, i));

						// azules 
						if(that.juego.tablero.fichas[i].selected)
							$( ".juego > .figura#cell_"+i ).addClass("activa").addClass("pristine").attr( "selected", "selected" );
					}


					that.updateCounterIntentos(that.juego.getIntentos());

					//Oculta las figuras seleccionadas luego de mostrar la secuencia a repetir
					setTimeout(that.ocultarAzules, that.juego.getTiempoParaOcultarAzules());

					$( ".juego" ).fadeIn(200);
	
				}
			) 
		});

		this.updateCounterVidas(this.juego.vidas);
		this.showMensaje("Nivel "+ this.juego.nivel);

		this.log();
	}
	
	log(){
		console.log('Nivel: '+ this.juego.nivel);
		this.tableroConsola();
		console.log('Vidas: '+ this.juego.vidas);
		console.log('Intentos:'+ this.juego.getIntentos());
		console.log('Aciertos: '+ this.juego.aciertos);
		console.log('Errores: '+ this.juego.errores);

	}

	crearFigura(tipofigura, r, id){
		let that = this;
		return $("<div>").addClass("figura "+tipofigura).width(r).height(r).attr('id', 'cell_'+id).click(function(){
			if(!that.juego.jugando)
				return;	

			if($(this).hasClass('pristine'))
				$(this).removeClass('pristine').addClass('dirty');

			// como figura notifico al juego que he sido clickeada
			that.juego.clicked(id);
		});
	}

	ocultarAzules(){
		$( ".juego > .figura.pristine" ).removeClass( "activa" );
	}

	mostrarAzules(){
		$( ".figura[selected='selected']:not(.activa)" ).addClass("activa");
	}

	marcarAcierto(id){
		$(".juego > .figura#cell_"+id).addClass("activa");
	}

	blikingFicha(id){
		let ficha = $(".juego > .figura#cell_"+id);
		ficha.fadeOut(500);
		ficha.fadeIn(500);
	}

	showLevel(nivel)
	{
		this.showMensaje("Nivel "+nivel);
		this.tableroConsola();
	}

	///

	updateCounterVidas(num){ 
		if(num<0)
			throw "Vidas<0 ?";

		$("#vidas").text((vidaChar[4]+' ').repeat(num));
	}

	flashUltimaVida(num){
		if(num==0)
			return;

		$("#vidas").text((vidaChar[4]+' ').repeat(num-1));
		$("#vida_rota").text(vidaChar[5]).fadeIn(600);
		$("#vida_rota").text(vidaChar[5]).fadeOut(1500);
	}

	updateCounterIntentos(num){
		$("#intentos").text(intentoChar[2].repeat(num)); 
	}

	showMensaje(str){
		$('div#mensaje').text(str);
	}

	showMensajeBlinking(str){
		$('div#mensaje').text(str);
		$('div#mensaje').fadeOut(1000);
		$('div#mensaje').fadeIn(1500);
	}

	disableClicks(){
		for(var i=0; i<this.juego.tablero.filas*this.juego.tablero.columnas;i++){
			$($(".juego > .figura").get(i)).off('click');
		}
	}

	tableroConsola()
	{
		for(let fil=0; fil<this.juego.tablero.filas;fil++){
			let hilera = '';
			for(let col=0;col<this.juego.tablero.columnas;col++){
				let att = this.juego.tablero.fichas[col + (fil*this.juego.tablero.columnas)].selected ? 'X' : 'O';
				hilera += att;
			}
			console.log(hilera);
		}
	}
}