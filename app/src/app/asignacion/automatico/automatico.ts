import { Component, signal } from '@angular/core';
import { AsignacionService } from '../../share/service/api/Asignacion.service';
import { Router } from '@angular/router';
import { NotificationService } from '../../share/service/app/notification.service';

@Component({
  selector: 'app-automatico',
  standalone: false,
  templateUrl: './automatico.html',
  styleUrl: './automatico.css'
})
export class Automatico {
  datos = signal<any>({
    success: false,
    data: {
      reglasConfiguradas: 0,
      ticketsPendientes: 0,
      reglas: [],
      tickets: [],
      asignacionesPropuestas: []
    }
  });

  loading = signal(false);

  constructor(
    private asignacionService: AsignacionService,
    private router: Router,
    private noti: NotificationService
  ) {
    this.listAsignacionesAutomatic();
  }

  listAsignacionesAutomatic() {
    this.loading.set(true);

    this.asignacionService.getPropuestasAsignacion().subscribe({
      next: (respuesta: any) => {
        console.log('Respuesta completa:', respuesta);
        this.datos.set(respuesta);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error:', error);
        this.loading.set(false);
        this.noti.error('Error', 'No se pudieron cargar las propuestas de asignación');
      }
    });
  }

  ejecutarAsignacionAutomatica() {
    this.loading.set(true);

    this.asignacionService.ejecutarAsignacionAutomatica().subscribe({
      next: (response: any) => {
        this.loading.set(false);
        this.noti.success(
          'Asignación Automática',
          `Se crearon ${response.asignacionesRealizadas} asignaciones exitosamente`,
          5000
        );
        this.listAsignacionesAutomatic();
      },
      error: (error) => {
        this.loading.set(false);
        this.noti.error('Error', 'No se pudieron ejecutar las asignaciones automáticas');
      }
    });
  }

  irAAsignacionManual() {
    this.router.navigate(['/manual']);
  }

  // MÉTODO PARA PRIORIDAD 
  getPrioridadClass(estado: string | undefined): string {
    if (!estado) {
      return 'estado-default';
    }
    const estadoLower = estado.toLowerCase().trim();
    if (estadoLower.includes('baja')) return 'estado-baja';    // Verde
    if (estadoLower.includes('media') || estadoLower.includes('media')) return 'estado-media'; 
    if (estadoLower.includes('alta') || estadoLower.includes('alta')) return 'estado-alta';//Rojo
    return 'estado-default';
  }

  //Metodo de Disponibilidad de Técnico
  getEstadoClass(estado: string | undefined): string {
    // Si estado es undefined, null o vacío, retorna 'default'
    if (!estado) {
      return 'estado-default';
    }
    const estadoLower = estado.toLowerCase().trim();
    
    if (estadoLower.includes('disponible')) return 'estado-disponible';    // Verde
    if (estadoLower.includes('ocupado') || estadoLower.includes('ocupado')) return 'estado-ocupado'; // Rojo
    if (estadoLower.includes('ausente') || estadoLower.includes('ausente')) return 'estado-ausente';
    return 'estado-default';
  }



  formatDate(dateString: Date): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatTime(dateString: Date): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}