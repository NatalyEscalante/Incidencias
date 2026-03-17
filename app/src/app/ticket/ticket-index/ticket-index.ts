
import { Component, signal, inject, computed } from '@angular/core';
import { TicketService } from '../../share/service/api/Ticket.service';
import { Router } from '@angular/router';
import { NotificationService } from '../../share/service/app/notification.service';
import { FileUploadService } from '../../share/service/api/file-upload.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthenticationService } from '../../share/service/app/authentication.service';

@Component({
  selector: 'app-ticket-index',
  standalone: false,
  templateUrl: './ticket-index.html',
  styleUrl: './ticket-index.css'
})
export class TicketIndex {
  datos = signal<any>({
    usuario: null,
    totalTickets: 0,
    tickets: []
  });

  private authService = inject(AuthenticationService);

  /** Signals */
  readonly isAuthenticated = this.authService.authenticated;
  readonly currentUser = this.authService.usuario;

  // obtener el ID del usuario logueado
  readonly userId = computed(() => {
    const user = this.currentUser();
    return user?.id || null;
  });


  // Variables para el diálogo
  showEstadoDialog = false;
  selectedTicket: any = null;
  siguienteEstado: string = '';
  estadoForm: FormGroup;
  currentFile?: File;
  preview = '';
  loading = false;
  cargandoEstado = false;

  constructor(
    private ticketService: TicketService,
    private router: Router,
    private noti: NotificationService,
    private uploadService: FileUploadService,
    private fb: FormBuilder
  ) {
    this.estadoForm = this.fb.group({
      observaciones: ['']
    });
    this.listTickets();
  }

  // Listar tickets
  listTickets() {
    // Obtener el ID del usuario logueado 
    const usuarioId = this.userId();

    if (!usuarioId) {
      console.log('Usuario no autenticado o ID no disponible');
      // redirigir al login si no está autenticado
      if (!this.isAuthenticated()) {
        this.router.navigate(['/usuario/login']);
      }
      return;
    }

    this.ticketService.getTicketsByRol(usuarioId).subscribe({
      next: (respuesta) => {
        console.log('Tickets recibidos:', respuesta);
        this.datos.set(respuesta);
      },
      error: (error) => {
        console.error('Error cargando tickets:', error);
        this.noti.error('Error', 'No se pudieron cargar los tickets');
      }
    });
  }

  // Navegar al detalle de un ticket
  detalle(id: number) {
    console.log('Navegando a detalle del ticket:', id);
    this.router.navigate(['/ticket', id]);
  }

  /** Control de roles */
  readonly role = computed(() => {
    const user = this.currentUser();
    if (!user || !user.rol) return null;

    // Si rol es un objeto con propiedad 
    if (user.rol && typeof user.rol === 'object' && 'nombre' in user.rol) {
      return user.rol.nombre;
    }

    return null;
  });
  readonly isAdmin = computed(() => this.role() === 'Administrador');
  readonly isUser = computed(() => this.role() === 'Cliente');
  readonly isTechnician = computed(() => this.role() === 'Técnico');

  // Abrir diálogo para cambiar estado
  abrirDialogoCambiarEstado(ticket: any) {
    this.selectedTicket = ticket;
    this.showEstadoDialog = true;
    this.cargandoEstado = true;
    this.estadoForm.reset();
    this.currentFile = undefined;
    this.preview = '';

    // Obtener siguiente estado disponible
    this.ticketService.getSiguienteEstado(ticket.id).subscribe({
      next: (response) => {
        this.cargandoEstado = false;

        if (response.success && response.data.puedeCambiar) {
          this.siguienteEstado = response.data.siguienteEstado;
        } else {
          this.noti.warning('No puede cambiar estado',
            response.data?.siguienteEstado || 'Este ticket no puede cambiar de estado');
          this.cerrarDialogo();
        }
      },
      error: (error) => {
        console.error('Error obteniendo siguiente estado:', error);
        this.cargandoEstado = false;
        this.noti.error('Error', 'No se pudo verificar el estado disponible');
        this.cerrarDialogo();
      }
    });
  }

  // Cerrar diálogo
  cerrarDialogo() {
    this.showEstadoDialog = false;
    this.selectedTicket = null;
    this.siguienteEstado = '';
    this.estadoForm.reset();
    this.currentFile = undefined;
    this.preview = '';
    this.loading = false;
    this.cargandoEstado = false;
  }

  // Seleccionar archivo
  selectFile(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) {
      this.currentFile = input.files[0];
      const reader = new FileReader();
      reader.onload = e => (this.preview = e.target?.result as string);
      reader.readAsDataURL(this.currentFile);
    } else {
      this.currentFile = undefined;
      this.preview = '';
    }
  }

  // Cambiar estado
  async cambiarEstado() {
    if (!this.selectedTicket || !this.siguienteEstado) {
      this.noti.error('Error', 'Datos incompletos');
      return;
    }

    this.loading = true;
    const formValue = this.estadoForm.value;

    try {
      let imagenRuta = '';

      // Subir imagen si existe
      if (this.currentFile) {
        try {
          const uploadResult: any = await this.uploadService.upload(this.currentFile, null).toPromise();
          imagenRuta = uploadResult?.fileName || '';
          console.log('Imagen subida:', imagenRuta);
        } catch (uploadError) {
          console.log('Imagen no subida, continuando sin ella...');
        }
      }

      // Preparar datos para cambiar estado
      const payload = {
        nuevoEstado: this.siguienteEstado,
        observaciones: formValue.observaciones || '',
        imagenes: imagenRuta ? [imagenRuta] : []
      };

      // Enviar cambio de estado
      this.ticketService.cambiarEstado(this.selectedTicket.id, payload).subscribe({
        next: (response: any) => {
          this.loading = false;
          console.log('Respuesta cambio de estado:', response);

          if (response.success) {
            this.noti.success('Estado cambiado', response.message);
            this.cerrarDialogo();
            // Recargar lista
            this.listTickets();
          } else {
            this.noti.error('Error', response.error || 'Error al cambiar estado');
          }
        },
        error: (error) => {
          this.loading = false;
          console.error('Error cambiando estado:', error);
          this.noti.error('Error', error.error?.error || 'No se pudo cambiar el estado');
        }
      });

    } catch (error) {
      this.loading = false;
      console.error('Error inesperado:', error);
      this.noti.error('Error', 'Error inesperado al procesar la solicitud');
    }
  }

  // Mostrar botón de cambiar estado - VERSIÓN CORREGIDA
  mostrarBotonCambiarEstado(ticket: any): boolean {
    if (!ticket || !ticket.estado) return false;

    const estado = ticket.estado.toLowerCase();
    const estadoNormalizado = estado.replace(/\s+/g, ''); 

    console.log(`Debug - Rol: ${this.role()}, Estado: ${estadoNormalizado}`);

    // 1. ADMINISTRADOR: Puede cerrar tickets resueltos Y cambiar tickets asignados/en proceso
    if (this.isAdmin()) {
      return estadoNormalizado.includes('resuelto') ||
        estadoNormalizado.includes('asignado') ||
        estadoNormalizado.includes('proceso');
    }

    // 2. CLIENTE: Solo puede cerrar tickets resueltos
    if (this.isUser()) {
      return estadoNormalizado.includes('resuelto');
    }

    // 3. TÉCNICO: Puede cambiar tickets asignados o en proceso
    if (this.isTechnician()) {
      return estadoNormalizado.includes('asignado') ||
        estadoNormalizado.includes('proceso');
    }

    return false;
  }

  // Texto del botón 
  getTextoBotonEstado(ticket: any): string {
    if (!ticket || !ticket.estado) return 'Cambiar Estado';

    const estado = ticket.estado.toLowerCase();

    if (estado.includes('asignado')) return 'Iniciar Proceso';
    if (estado.includes('proceso')) return 'Marcar Resuelto';
    if (estado.includes('resuelto')) return 'Cerrar Ticket';

    return 'Cambiar Estado';
  }

  // Estilos para el estado
  getEstadoClass(estado: string | undefined): string {
    if (!estado) return 'default';

    const estadoLower = estado.toLowerCase().replace(/\s+/g, '');;

    if (estadoLower.includes('pendiente')) return 'pendiente';
    if (estadoLower.includes('asignado')) return 'asignado';
    if (estadoLower.includes('proceso')) return 'proceso';
    if (estadoLower.includes('resuelto')) return 'resuelto';
    if (estadoLower.includes('cerrado')) return 'cerrado';

    return 'default';
  }

  // Formatear fecha
  formatDate(dateString: string): string {
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  }
}