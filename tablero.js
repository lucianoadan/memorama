class Tablero
{
	constructor(nivel, intentos)
	{ 	
		this.nivel = nivel;
		this.filas = Math.ceil(nivel - ((nivel*0.5) -1)); 
		this.columnas = Math.ceil((nivel-1) - (((nivel-1)*0.5) -2)); 
		this.acertables = Math.ceil(this.filas*this.columnas/3);
		this.fichas = [];
		this.errores = 0;
		this.intentos = this.intentos;

		this.hacerTablero();
	}	

	hacerTablero(){
		let celdas = this.filas * this.columnas;

		for(let i=0;i<this.filas * this.columnas; i++){
			this.fichas[i] = false;
		}

		let count=0;
		while(count < this.acertables){
			let random = Math.ceil(Math.random() * celdas)-1;
			
			if(this.fichas[random]!=true){
				this.fichas[random]=true;	
				count++;
			}
		}
	}
}