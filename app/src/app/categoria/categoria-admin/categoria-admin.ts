import { Component, signal } from '@angular/core';
import { CategoriaModel } from '../../share/models/CategoriaModel';
import { CategoriaService } from '../../share/service/api/categoria.service'
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-categoria-admin',
  standalone: false,
  templateUrl: './categoria-admin.html',
  styleUrl: './categoria-admin.css'
})
export class CategoriaAdmin {
  // Signal
  //Respuesta del API
  datos = signal<CategoriaModel[]>([]);

  constructor(private vjService: CategoriaService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.listCategoria()
  }

  // Listar todos los videojuegos del API
  listCategoria() {
    this.vjService.get().subscribe((respuesta: CategoriaModel[]) => {
      console.log(respuesta);
      this.datos.set(respuesta);
    });
  }

  // Navegar al detalle 
  detalle(id: number) {
    this.router.navigate(['/categoria', id]);
  }

  actualizarVideojuego(id: number) {
    this.router.navigate(['/categoria/update', id], {
      relativeTo: this.route,
    });
  }

  crearVideojuego() {
    this.router.navigate(['/categoria/create'], {
      relativeTo: this.route,
    });
  }

  // Formatear tiempo
  formatTime(tiempo: string): string {
    if (!tiempo) return 'No definido';

    const [hours, minutes] = tiempo.split(':').map(Number);

    if (hours > 0) {
      return `${hours} ${hours === 1 ? 'hora' : 'horas'}`;
    } else if (minutes > 0) {
      return `${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
    } else {
      return 'Inmediato';
    }
  }
}
