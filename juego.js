var Tfigura = 55; //Tamaño de la figura
var IniciaJuego = false // Iniciar juego Falso=No
var columnas = filas = 2 // Tamaño inicial de fichas o ciruclos en el tablero 2x2 osea 4 circulos
var vidas = 3;
var aciertos = 0;
var nivel = 1;
var audio;


$(document).ready(function(){
	//Genero el juego segun la cantidad de columnas y filas de cada nivel de dificultad
	generaJuego(columnas ,filas);
});
 
function generaJuego(c,r){
	 console.log("Generando juego... nivel "+nivel);	

	//Borramos todos los elementos del escenario o tablero de juego
	$( ".juego" ).fadeOut( 1000, function()
	{ 
	// al finalizar el metodo desvanecer
	// vaciar los elementos del juego en el escenario o tablero de juego
	
		$( ".juego" ).empty();
		 
		// Expandir el escenario o tablero de juego para acomodar los circulos
		$( ".contenedor" ).animate({height: ((Tfigura+8)*r)+"px",width: ((Tfigura+8)*c)+"px"},1000, 
		// al finalizar la expansion con amimate()
		// creo las nuevas figuras segun la nueva dimension de la pantalla i nivel de juego
			function()
			{
				for(i = 0; i < (c * r); i++)
					$( ".juego" ).append(crearFigura("circulo", Tfigura)); 

				$( ".juego" ).fadeIn(200);
				 
				// Creo en forma aleatoria cuales son los circulos del tablero que podran ser cliqueados y cuales no
				crearFigurasAzules();
			}
		) 
	});

	updateCounterVidas(vidas);
	updateCounterIntentos(getIntentos());

	console.log('Vidas: '+ vidas);
	console.log('Intentos:'+ getIntentos());
	console.log('Aciertos '+getAciertos());
}

 
function crearFigura(tipofigura, r){
	//Si se hace clic en alguna figura
	return $("<div>").addClass("figura "+tipofigura).width(r).height(r).click(function(){
		if(IniciaJuego)
		{
			var TotalSeleccionadas = getAcertables();

			var intentos = getIntentos();
			var aciertos = getAciertos();

			//Verifico si esa figura tiene el atributo seleccionado o`sea si es una de las que estuvieron activas en azul
			if($(this).attr("selected") == "selected"){
				$(this).addClass("activa");

				// no repito audio
				if(aciertos<getAciertos()){
					audio = new Audio('ok.mp3');
					audio.play();
				}
			}
			else{
				$(this).addClass("error");

				// bliking
				$(this).fadeOut(500);
				$(this).fadeIn(500);

				// no repito audio
				if(intentos>getIntentos()){
					audio = new Audio('roto.mp3');
					audio.play();
				}
			}
			 
			//Si la cantidad de clic en circulos activos y la cantidad de clic en circulos no activos es mayor a la cantidad de clic realizados no conti nuamos el juego y volveremos a regenerar la pantalla luego sin cambiar el nivel
			var errors = getErrors();
			var intentos = getIntentos();

			updateCounterVidas(vidas);
			updateCounterIntentos(intentos);

			console.log('---------------------------');
			console.log('Nivel '+nivel);
			console.log('Errors '+errors);
			console.log('Restan intentos: '+intentos);
			console.log('Aciertos '+getAciertos());
			console.log('Vidas: '+vidas);
			console.log('---------------------------');


			if($(".activa").length + errors >= TotalSeleccionadas)
			{

				IniciaJuego = false;
				 
				// Si se aciertan todas ...
				if(getAciertos() == getAcertables()){
				 
					/*
					swal({
					  title: "Bien Hecho!",
					  text: "Haz Acertado todo!",
					  icon: "success",
					  button: "siguiente nivel!",
					});
					*/
					showMensaje("Bien Hecho!");

					// timeout para evitar superposición de sonidos	
					setTimeout(function(){
						audio = new Audio('exito.mp3');
						audio.play();
					}, 700);

					levelUp();
					setTimeout(function(){
						generaJuego(columnas,filas);
						showMensaje("");
						IniciaJuego=true;
					}, 2000);
					return;
				}
				//else{ document.write("Haz Fallado, intenta nuevamente");}
				else{
					if (intentos==0)
					{
						/*
						swal({
							title: "Haz fallado!",
							text: "No acertaste!",
							icon: "error",
							button: "Probar otra vez!",
						});
						*/
						showMensaje("Perdiste una vida");
						mostrarAzules();
						vidas--;

						// timeout para evitar superposición de sonidos	
						setTimeout(function(){
							audio = new Audio('fail.mp3');
							audio.play();
						}, 1000);

						updateCounterVidas(vidas);
						console.log('Vidas: '+vidas);

						if (vidas != 0){
							setTimeout(function(){
								generaJuego(columnas,filas);
								showMensaje("");
								IniciaJuego = true;
							}, 2000);
						}	
					}else{
						setTimeout(()=>{IniciaJuego=true;},1200);
					}
				}

				if (vidas == 0){
					console.log('Perdiste');
					showMensaje("Perdiste!");
					IniciaJuego = false;
				}
				
			}

		}
	});
}

function crearFigurasAzules(){
	var length = $( ".juego > .figura" ).length
	 
	for(var count = 0; count < Math.ceil(length/3);){
		var random = Math.ceil(Math.random()*length ); 
		if(random < length){
			if(!$( ".juego > .figura" ).eq(random).hasClass("activa")){
				$( ".juego > .figura" ).eq(random).addClass("activa").attr( "selected", "selected" );
				count++;
			}
		}
	} 

	updateCounterIntentos(getIntentos());
	showTableroConsola();

	//Oculta las figuras seleccionadas luego de mostrar la secuencia a repetir
	setTimeout(ocultarAzules,1200)
}

function ocultarAzules(){
	$( ".juego > .figura" ).removeClass( "activa" );
	IniciaJuego = true;
}


function mostrarAzules(){
	$( ".figura[selected='selected']:not(.activa)" ).addClass("activa");
}

function levelUp(){
	if(columnas == filas)
		columnas++;
	else if( columnas > filas)
		filas++;

	//El maximo nivel son 6 filas por 6 columnas
	if(columnas > 12){
		columnas = 12;
		filas = 12;
	} 

	nivel++;
}

//
// Getters
// 
function getErrors(){
	return $(".error").length;
}

function getAciertos(){
	return $(".figura.activa").length;
}

function getAcertables(){
	return $(".figura[selected='selected']").length;
}

function getIntentos(){
	var errors = $(".error").length;
	return Math.ceil(filas*columnas/3) - errors;
}

function getNivel(){
	return nivel;
}

function getVidas(){
	return vidas;
}

///

function updateCounterVidas(num){
	$("#vidas").text("♡".repeat(num));
}

function updateCounterIntentos(num){
	$("#intentos").text("♖".repeat(num)); // ⚔
}

function showMensaje(str){
	$('div#mensaje').text(str);
}

///

function showTableroConsola(){
	var hilera;

	for(var fil=0; fil<filas;fil++){
		hilera = '';
		for(var col=0;col<columnas;col++){
			var att = $($(".juego > .figura").get( col+ (fil*columnas) )).attr("selected");
			hilera += (att == "selected" ? 'X' : 'O');
		}
		console.log(hilera);
	}
}

function disableClicks(){
	for(var i=0; i<filas*columnas;i++){
		$($(".juego > .figura").get(i)).off('click');
	}
}
	
	