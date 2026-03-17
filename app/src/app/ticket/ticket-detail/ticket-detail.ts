import { Component, inject, signal, computed  } from '@angular/core';
import { TicketDetailResponse } from '../../share/interfaces/ticket-detail.response';
import { TicketService } from '../../share/service/api/Ticket.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValoracionService } from '../../share/service/api/valoracion.service';
import { AuthenticationService } from '../../share/service/app/authentication.service';
import { NotificationService } from '../../share/service/app/notification.service';

@Component({
  selector: 'app-ticket-detail',
  standalone: false,
  templateUrl: './ticket-detail.html',
  styleUrl: './ticket-detail.css'
})

export class TicketDetail {
  datos = signal<TicketDetailResponse | null>(null);

// Variables para valoración
  showValoracionDialog = false;
  valoracionForm: FormGroup;
  selectedStars = 0;
  loadingValoracion = false;

  private ticketService = inject(TicketService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private valoracionService = inject(ValoracionService);
  private authService = inject(AuthenticationService);
  private noti = inject(NotificationService);
  private fb = inject(FormBuilder);

  // Signals para usuario
  readonly isAuthenticated = this.authService.authenticated;
  readonly currentUser = this.authService.usuario;
  readonly userId = computed(() => {
    const user = this.currentUser();
    return user?.id || null;
  });
  
  readonly isUser = computed(() => {
    const user = this.currentUser();
    if (!user || !user.rol) return false;
    
    if (user.rol && typeof user.rol === 'object' && 'nombre' in user.rol) {
      return user.rol.nombre === 'Cliente';
    }
    
    return false;
  });

  constructor() {
    // Inicializar formulario de valoración
    this.valoracionForm = this.fb.group({
      ticketId: ['', Validators.required],
      comentario: ['', [Validators.minLength(5), Validators.maxLength(500)]],
      valoracion: [0, [Validators.required, Validators.min(1), Validators.max(5)]]
    });

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

  // ============ MÉTODOS PARA VALORACIONES ============

  // Verificar si se puede mostrar el formulario de valoración
  mostrarFormularioValoracion(): boolean {
    const ticket = this.datos();
    
    // Verificar condiciones
    if (!ticket || !this.isUser() || !this.isAuthenticated()) {
      return false;
    }

    // Solo tickets cerrados pueden ser valorados
    const estadoNormalizado = ticket.estado?.toLowerCase().replace(/\s+/g, '') || '';
    const isCerrado = estadoNormalizado.includes('cerrado');
    
    // Verificar si el cliente es el dueño del ticket
    const isTicketOwner = ticket.usuarioSolicitante?.id === this.userId();
    
    // Verificar si ya tiene valoración
    const tieneValoracion = ticket.valoraciones && ticket.valoraciones.length > 0;
    
    return isCerrado && isTicketOwner && !tieneValoracion;
  }

  // Abrir diálogo para crear valoración
  abrirValoracionDialog() {
    const ticket = this.datos();
    if (!ticket) return;
    
    this.showValoracionDialog = true;
    this.selectedStars = 0;
    
    // Resetear formulario
    this.valoracionForm.reset();
    this.valoracionForm.patchValue({
      ticketId: ticket.id
    });
  }

  // Cerrar diálogo de valoración
  cerrarValoracionDialog() {
    this.showValoracionDialog = false;
    this.selectedStars = 0;
    this.valoracionForm.reset();
    this.loadingValoracion = false;
  }

  // Seleccionar estrellas
  seleccionarEstrellas(rating: number) {
    this.selectedStars = rating;
    this.valoracionForm.patchValue({
      valoracion: rating
    });
  }

  // Enviar valoración
  enviarValoracion() {
    if (this.valoracionForm.invalid) {
      this.valoracionForm.markAllAsTouched();
      
      if (this.selectedStars === 0) {
        this.noti.warning('Valoración requerida', 'Por favor, seleccione una calificación con estrellas.');
        return;
      }
      
      this.noti.warning('Formulario incompleto', 'Por favor, complete todos los campos requeridos.');
      return;
    }

    this.loadingValoracion = true;
    const formValue = this.valoracionForm.value;

    // Crear payload para la valoración
    const payload = {
      ticketId: formValue.ticketId,
      comentario: formValue.comentario || '',
      valoracion: formValue.valoracion
    }as any;;

    this.valoracionService.create(payload).subscribe({
      next: (response) => {
        this.loadingValoracion = false;
        this.noti.success('Valoración enviada', '¡Gracias por su valoración!');
        this.cerrarValoracionDialog();
        
        // Recargar el ticket para mostrar la nueva valoración
        this.obtenerTicket(formValue.ticketId);
      },
      error: (error) => {
        this.loadingValoracion = false;
        console.error('Error enviando valoración:', error);
        
        let errorMessage = 'Error al enviar la valoración. Por favor, intente de nuevo.';
        if (error.status === 409) {
          errorMessage = 'Ya ha enviado una valoración para este ticket.';
        } else if (error.status === 403) {
          errorMessage = 'No tiene permiso para valorar este ticket.';
        } else if (error.status === 400) {
          errorMessage = 'El ticket no está cerrado o no existe.';
        } else if (error.error && error.error.message) {
          errorMessage = error.error.message;
        }
        
        this.noti.error('Error', errorMessage);
      }
    });
  }

  // ============ FIN MÉTODOS PARA VALORACIONES ============


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