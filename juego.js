var Tfigura = 55; //Tamaño de la figura
var IniciaJuego = false // Iniciar juego Falso=No
var ProximoNivel = true; // Verdadero continuar el juego si es falso el juego se detiene
var columnas = filas = 2 // Tamaño inicial de fichas o ciruclos en el tablero 2x2 osea 4 circulos
var vidas = 3;
var intentos = 0;
var aciertos = 0;


$(document).ready(function(){
	//Genero el juego segun la cantidad de columnas y filas de cada nivel de dificultad
	GeneraJuego(columnas ,filas);
});
 
function GeneraJuego(c,r){
	 console.log("Generando juego...");	

	//Si ProximoNivel es igual a falso indica que el juego debera detenerse
	if(!ProximoNivel )
		return;
	 
	//Detengo el juego
	ProximoNivel = false;
	//Borramos todos los elementos del escenario o tablero de juego
	$( ".juego" ).fadeOut( 1000, 
		// al finalizar el metodo desvanecer
		// vaciar los elementos del juego en el escenario o tablero de juego
		function() { 
			$( ".juego" ).empty();
			 
			// Expandir el escenario o tablero de juego para acomodar los circulos
			$( ".contenedor" ).animate({height: ((Tfigura+8)*r)+"px",width: ((Tfigura+8)*c)+"px"},1000, 
			// al finalizar la expansion con amimate()
			// creo las nuevas figuras segun la nueva dimension de la pantalla i nivel de juego
				function()
				{
					for(i = 0; i < (c * r); i++)
						$( ".juego" ).append(CrearFigura("circulo", Tfigura)); 

					$( ".juego" ).fadeIn(200);
					 
					// Creo en forma aleatoria cuales son los circulos del tablero que podran ser cliqueados y cuales no
					CrearFiguraAzul();
				}
			) 
	});

	//intentos = $( ".figura[selected='selected']" ).length;
	// console.log('Intentos:'+intentos);
	console.log('Vidas: '+vidas);
 
}
 
function CrearFigura(tipofigura, r){
	//Si se hace clic en alguna figura
	return $("<div>").addClass("figura "+tipofigura).width(r).height(r).click(function(){
		if(IniciaJuego)
		{
			var TotalSeleccionadas = $( ".figura[selected='selected']" ).length;

			//Verifico si esa figura tiene el atributo seleccionado o`sea si es una de las que estuvieron activas en azul
			if($(this).attr("selected") == "selected")
				$(this).addClass("activa");
			else{
				$(this).addClass("error");
				intentos--;
			}
			 
			//Si la cantidad de clic en circulos activos y la cantidad de clic en circulos no activos es mayor a la cantidad de clic realizados no conti nuamos el juego y volveremos a regenerar la pantalla luego sin cambiar el nivel
			var errors = $(".error").length;
			console.log('Errors '+errors);
			console.log('Restan intentos: '+intentos);

			if($(".activa").length + errors >= TotalSeleccionadas)
			{

				// IniciaJuego = false;
				//$( ".figura[selected='selected']:not(.activa)" ).addClass("activa"); 
				 
				// Si el nivel de fallo en clic es 0 significa que acertamos la secuencia
				if($( ".figura[selected='selected'].activa" ).length == $( ".figura[selected='selected']" ).length){
				 
					//alert("Haz acertado!! Pasas al Proximo nivel");
					swal({
					  title: "Bien Hecho!",
					  text: "Haz Acertado todo!",
					  icon: "success",
					  button: "siguiente nivel!",
					});
					

					if(columnas == filas)
						columnas++;
					else if( columnas > filas)
						filas++;

					//El maximo nivel son 6 filas por 6 columnas
					if(columnas > 12){
						columnas = 12;
						filas = 12;
					} 

					GeneraJuego(columnas,filas);
					return;
				}
				//else{ document.write("Haz Fallado, intenta nuevamente");}
				else{
					if (intentos==0){
						/*
						swal({
							title: "Haz fallado!",
							text: "No acertaste!",
							icon: "error",
							button: "Probar otra vez!",
						});
						*/
						$('div#mensaje').text("Perdiste una vida");
						$( ".figura[selected='selected']:not(.activa)" ).addClass("activa");
						vidas--;

						setTimeout(function(){
							GeneraJuego(columnas,filas);
							$('div#mensaje').text("");
						}, 2000);
					}
				}

				if (vidas==0){
					console.log('Perdiste');
					$('div#mensaje').text("Perdiste!");
					IniciaJuego = false;
				}
				
			}

		}
	});
}

function CrearFiguraAzul(){
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

	intentos = $(".figura[selected='selected']").length;

	//Oculta las figuras seleccionadas luego de mostrar la secuencia a repetir
	window.setTimeout(OcultarfigurasAzules,1200)
}

function OcultarfigurasAzules(){
	$( ".juego > .figura" ).removeClass( "activa" );
	IniciaJuego = true;
	ProximoNivel = true;
}