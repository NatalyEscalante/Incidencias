import { Component, inject, signal } from '@angular/core';
import { CategoriaModel } from '../../share/models/CategoriaModel';
import { CategoriaService } from '../../share/service/api/categoria.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-categoria-details',
  standalone: false,
  templateUrl: './categoria-details.html',
  styleUrl: './categoria-details.css'
})
export class CategoriaDetails {
  datos = signal<CategoriaModel | null>(null);
  private vjService = inject(CategoriaService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'))
    if (!isNaN(id)) {
      this.obtenerCategoria(id)
    }
  }

  obtenerCategoria(id: number) {
    this.vjService.getById(id).subscribe((data: CategoriaModel) => {
      console.log(data);
      this.datos.set(data);
    });
  }

  goBack(): void {
    this.router.navigate(['/categoria/']);
  }

  formatTime(timeString: string | undefined): string {
    if (!timeString) return 'No definido';
    
    const [hours, minutes] = timeString.split(':').map(Number);
    
    if (hours > 0) {
      return `${hours} ${hours === 1 ? 'hora' : 'horas'}`;
    } else if (minutes > 0) {
      return `${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
    } else {
      return 'Inmediato';
    }
  }
}