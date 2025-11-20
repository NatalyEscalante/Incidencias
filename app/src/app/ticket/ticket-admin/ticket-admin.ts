import { Component, signal } from '@angular/core';
import { TicketModel } from '../../share/models/TicketModel';
import { TicketService } from '../../share/service/api/Ticket.service';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-ticket-admin',
  standalone: false,
  templateUrl: './ticket-admin.html',
  styleUrl: './ticket-admin.css'
})
export class TicketAdmin {
  //Signal - Respuesta del API
  datos = signal<any>({
    usuario: null,
    totalTickets: 0,
    tickets: []
  });

  constructor(
    private ticketService: TicketService,
    private router: Router,
    private route: ActivatedRoute
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

  actualizarVideojuego(id: number) {
    this.router.navigate(['/ticket/update', id], {
      relativeTo: this.route,
    });
  }

  crearVideojuego() {
    this.router.navigate(['/ticket/create'], {
      relativeTo: this.route,
    });
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
