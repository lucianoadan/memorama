class Tablero
{
	constructor(nivel)
	{ 	
		this.filas = Math.ceil(nivel - ((nivel*0.5) -1)); 
		this.columnas = Math.ceil((nivel-1) - (((nivel-1)*0.5) -2)); 
		this.acertables = Math.ceil(this.filas*this.columnas/3);
		this.fichas = [];

		this.hacerTablero();
	}	

	hacerTablero(){
		let celdas = this.filas * this.columnas;

		for(let i=0;i<this.filas * this.columnas; i++){
			this.fichas[i] = {clicked: false, selected:false, active:false};
		}

		let count=0;
		while(count < this.acertables){
			let random = Math.ceil(Math.random() * celdas)-1;
			
			if(this.fichas[random].selected != true){
				this.fichas[random].selected = true;	
				count++;
			}
		}
	}

	getActivas(){
		let activas = 0;
		for(let i=0;i<this.filas * this.columnas; i++){
			activas += this.fichas[i].active;
		}
		return activas;
	}
	
}