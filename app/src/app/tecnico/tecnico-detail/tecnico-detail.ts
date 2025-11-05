import { Component, signal, inject } from '@angular/core';
import { UsuarioModel } from '../../share/models/UsuarioModel';
import { TecnicoService } from '../../share/service/api/Tecnico.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-tecnico-detail',
  standalone: false,
  templateUrl: './tecnico-detail.html',
  styleUrl: './tecnico-detail.css'
})
export class TecnicoDetail {
  datos = signal<UsuarioModel | null>(null);
  private vjService = inject(TecnicoService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);


  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'))
    if (!isNaN(id)) {
      this.obtenerCategoria(id)
    }
  }

  obtenerCategoria(id: number) {
    this.vjService.getById(id).subscribe((data: UsuarioModel) => {
      console.log(data);
      this.datos.set(data);
    });
  }

  goBack(): void {
    this.router.navigate(['/tecnico/']);
  }
  getEstadoClass(estado: string | undefined): string {
    if (!estado) {
      return 'default';
    }

    switch (estado.toLowerCase()) {
      case 'disponible':
        return 'disponible';
      case 'ocupado':
        return 'ocupado';
      case 'ausente':
        return 'ausente';
      default:
        return 'default';
    }
  }

  getEstadoIcon(estado: string | undefined): string {
    if (!estado) {
      return 'help_outline';
    }

    switch (estado.toLowerCase()) {
      case 'disponible':
        return 'check_circle';
      case 'ocupado':
        return 'do_not_disturb';
      case 'ausente':
        return 'schedule';
      default:
        return 'help_outline';
    }
  }

}
