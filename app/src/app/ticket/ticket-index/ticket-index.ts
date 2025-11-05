import { Component, signal } from '@angular/core';
import { TicketService } from '../../share/service/api/Ticket.service';
import { Router } from '@angular/router';
import { TicketModel } from '../../share/models/TicketModel';

@Component({
  selector: 'app-ticket-index',
  standalone: false,
  templateUrl: './ticket-index.html',
  styleUrl: './ticket-index.css'
})
export class TicketIndex {
  //Signal - Respuesta del API
  datos = signal<any>({
    usuario: null,
    totalTickets: 0,
    tickets: []
  });


  constructor(
    private ticketService: TicketService,
    private router: Router
  ) {
    this.listTickets();
  }

  //Listar todos los Tickets del API
  listTickets() {
    const usuarioRol = 1;

    this.ticketService.getTicketsByRol(usuarioRol).subscribe({
      next: (respuesta: any) => {
        console.log('Respuesta completa:', respuesta);
        this.datos.set(respuesta);
      }
    });
  }


  // Navegar al detalle de un ticket
  detalle(id: number) {
    this.router.navigate(['/ticket', id]);
  }

  // Método para obtener clase del estado
  getEstadoClass(estado: string | undefined): string {
    if (!estado) {
      return 'default';
    }

    const estadoLower = estado.toLowerCase().trim();

    if (estadoLower.includes('pendiente')) {
      return 'pendiente';
    } else if (estadoLower.includes('asignado')) {
      return 'asignado';
    } else if (estadoLower.includes('proceso')) {
      return 'progreso';
    } else if (estadoLower.includes('resuelto')) {
      return 'resuelto';
    } else if (estadoLower.includes('cerrado')) {
      return 'cerrado';
    }
    return 'default';
  }

  // Método para formatear fecha
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}