import { Component, inject, signal } from '@angular/core';
import { TicketDetailResponse } from '../../share/interfaces/ticket-detail.response';
import { TicketService } from '../../share/service/api/Ticket.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-ticket-detail',
  standalone: false,
  templateUrl: './ticket-detail.html',
  styleUrl: './ticket-detail.css'
})
export class TicketDetail {
  datos = signal<TicketDetailResponse | null>(null);
  private ticketService = inject(TicketService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'))
    if (!isNaN(id)) {
      this.obtenerTicket(id)
    }
  }

  obtenerTicket(id: number) {
    this.ticketService.getTicketDetail(id).subscribe((data: TicketDetailResponse) => {
      console.log('Datos del ticket:', data);
      this.datos.set(data);
    });
  }

  goBack(): void {
    this.router.navigate(['/ticket/']);
  }

  getEstadoClass(estado: string | undefined): string {
    if (!estado) return 'default';
    const estadoLower = estado.toLowerCase().trim();
    if (estadoLower.includes('pendiente')) return 'pendiente';
    if (estadoLower.includes('asignado')) return 'asignado';
    if (estadoLower.includes('proceso')) return 'proceso';
    if (estadoLower.includes('resuelto')) return 'resuelto';
    if (estadoLower.includes('cerrado')) return 'cerrado';
    return 'default';
  }

  getPrioridadClass(prioridad: string | undefined): string {
    if (!prioridad) return 'default';
    const prioridadLower = prioridad.toLowerCase();
    if (prioridadLower.includes('alta')) return 'alta';
    if (prioridadLower.includes('media')) return 'media';
    if (prioridadLower.includes('baja')) return 'baja';
    return 'default';
  }

  getSLAStatusClass(estado: string | undefined): string {
    if (!estado) return 'pendiente';
    const estadoLower = estado.trim().toLowerCase();
    if (estadoLower.includes('incumplido')) return 'incumplido';
    else if (estadoLower.includes('cumplido')) return 'cumplido';
    return 'pendiente';
  }


  formatTime(tiempo: any): string {
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


  formatDateTime(dateInput: any): string {
    if (!dateInput) return 'No definida';

    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return 'Fecha inválida';

    // Forzar la fecha/hora UTC sin conversión de zona horaria
    return date.toLocaleDateString('es-ES', {
      timeZone: 'UTC', 
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false 
    });
  }

  formatDate(dateInput: any): string {
    if (!dateInput) return 'No definida';

    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return 'Fecha inválida';

    return date.toLocaleDateString('es-ES', {
      timeZone: 'UTC', 
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}