import { Component, signal } from '@angular/core';
import { CategoriaModel } from '../../share/models/CategoriaModel';
import { CategoriaService } from '../../share/service/api/categoria.service'
import { Router } from '@angular/router';

@Component({
  selector: 'app-categoria-index',
  standalone: false,
  templateUrl: './categoria-index.html',
  styleUrl: './categoria-index.css'
})
export class CategoriaIndex {
// Signal
  //Respuesta del API
  datos = signal<CategoriaModel[]>([]);

  constructor(private vjService: CategoriaService,
    private router:Router
  ){
    this.listCategoria()
  }

  // Listar todos los videojuegos del API
  listCategoria() {
    this.vjService.get().subscribe((respuesta: CategoriaModel[]) => {
      console.log(respuesta);
      this.datos.set(respuesta);
    });
  }

  // Navegar al detalle de un videojuego
  detalle(id: number) {
    this.router.navigate(['/categoria', id]);
  }

  // Array de colores
  private colors: string[] = [
    'linear-gradient(135deg, #c34646ff, #c05c5cff)',    // Rojo
    'linear-gradient(135deg, #FFA726, #FFB74D)',    // Naranja
    'linear-gradient(135deg, #42A5F5, #64B5F6)',    // Azul
    'linear-gradient(135deg, #66BB6A, #81C784)',    // Verde
    'linear-gradient(135deg, #2F8F9D, #3BACB6)',    // Turquesa
    'linear-gradient(135deg, #5C6BC0, #7986CB)'     // Índigo
  ];

  // Generar color aleatorio
  getRandomColor(): string {
    const randomIndex = Math.floor(Math.random() * this.colors.length);
    return this.colors[randomIndex];
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
