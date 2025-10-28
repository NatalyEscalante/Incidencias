import { Component, signal } from '@angular/core';
import { UsuarioModel } from '../../share/models/UsuarioModel';
import { TecnicoService } from '../../share/service/api/Tecnico.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tecnico-index',
  standalone: false,
  templateUrl: './tecnico-index.html',
  styleUrl: './tecnico-index.css'
})
export class TecnicoIndex {
// Signal
  //Respuesta del API
  datos = signal<UsuarioModel[]>([]);
  
  constructor(private vjService: TecnicoService,
    private router:Router
  ){
    this.listTecnicos()
  }

  // Listar todos los videojuegos del API
  listTecnicos() {
    this.vjService.get().subscribe((respuesta: UsuarioModel[]) => {
      console.log(respuesta);
      this.datos.set(respuesta);
    });
  }

  // Navegar al detalle de un videojuego
  detalle(id: number) {
    this.router.navigate(['/tecnico', id]);
  }

  getEstadoClass(estado: string | undefined): string {
    // Si estado es undefined, null o vacío, retorna 'default'
    if (!estado) {
        return 'estado-default';
    }
    
    switch (estado.toLowerCase()) {
        case 'disponible':
            return 'estado-disponible';
        case 'ocupado':
            return 'estado-ocupado';
        case 'ausente':
            return 'estado-ausente';
        default:
            return 'estado-default';
    }
}
}
