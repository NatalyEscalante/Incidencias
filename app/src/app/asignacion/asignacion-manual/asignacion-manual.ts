import { Component, OnInit, signal } from '@angular/core';
import { TicketService } from '../../share/service/api/Ticket.service';
import { TecnicoService } from '../../share/service/api/Tecnico.service';
import { AsignacionService } from '../../share/service/api/Asignacion.service';
import { NotificationService } from '../../share/service/app/notification.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-manual',
  standalone: false,
  templateUrl: './asignacion-manual.html',
  styleUrl: './asignacion-manual.css'
})
export class ManualComponent implements OnInit {
  currentDate: Date = new Date();
  // Signals para manejo de estado reactivo
  ticketsPendientes = signal<any[]>([]);
  tecnicosDisponibles = signal<any[]>([]);
  loading = signal(false);
  showTecnicosTable = signal(false);

  // Variables para almacenar selecciones
  selectedTicket: any = null;
  filteredTecnicos: any[] = [];
  selectedTecnicoId: number | null = null;

  // Formulario para la justificación
  asignacionForm: FormGroup;

  constructor(
    private ticketService: TicketService,
    private tecnicoService: TecnicoService,
    private asignacionService: AsignacionService,
    private noti: NotificationService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.asignacionForm = this.fb.group({
      justificacion: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]]
    });
  }

/**
* Ciclo de vida OnInit: inicializa el formulario, carga listas 
*/
  ngOnInit(): void {
    this.loadTicketsPendientes();
    this.loadTecnicos();
  }

  /**
   * Carga los tickets pendientes sin asignar
   */
  loadTicketsPendientes(): void {
    this.loading.set(true);
    this.ticketService.get().subscribe({next: (respuesta: any) => {
        this.ticketsPendientes.set(respuesta);
        this.loading.set(false);
        console.log('Tickets cargados:', respuesta);
      },
      error: (error) => {
        console.error('Error al cargar tickets:', error);
        this.noti.error('Error', 'No se pudieron cargar los tickets pendientes');
        this.loading.set(false);
      }
    });
  }

  /**
   * Carga todos los técnicos
   */
  loadTecnicos(): void {
    this.tecnicoService.get().subscribe({next: (respuesta: any) => {
        this.tecnicosDisponibles.set(respuesta);
        console.log('Técnicos cargados:', respuesta);
      },
      error: (error) => {
        console.error('Error al cargar técnicos:', error);
      }
    });
  }

  /**
   * Método que se ejecuta al hacer clic en "Seleccionar" de un ticket
   * @param ticketId ID del ticket seleccionado
   */
  seleccionarTicket(ticketId: number): void {
    // Buscar el ticket seleccionado
    this.selectedTicket = this.ticketsPendientes().find(ticket => ticket.id === ticketId);

    if (!this.selectedTicket) {
      this.noti.error('Error', 'No se encontró el ticket seleccionado');
      return;
    }
    
    // Filtrar técnicos que cumplan con los requisitos
    this.filtrarTecnicos(this.selectedTicket);
    this.showTecnicosTable.set(true);
    this.selectedTecnicoId = null;
    this.asignacionForm.reset();
  }

  /**
   * Filtra los técnicos según la especialidad del ticket y disponibilidad
   * @param ticket Ticket seleccionado
   */
  filtrarTecnicos(ticket: any): void {
    //  Obtiene especialidades requeridas del ticket
    const especialidadesRequeridasNombres = ticket.categoria.especialidades.map((esp: any) => esp.nombre);
    
    console.log('Especialidades requeridas:', especialidadesRequeridasNombres);

    // Filtrar técnicos que:
    // 1. Tengan al menos una de las especialidades requeridas 
    // 2. Estén disponibles 
    // 3. Estén activos
    this.filteredTecnicos = this.tecnicosDisponibles().filter(tecnico => {
      // Verificar si el técnico está disponible
      const estaDisponible = tecnico.estado?.estado === "Disponible";
      
      // Verificar si está activo
      const estaActivo = tecnico.activo === true;
      
      if (!estaDisponible || !estaActivo) {
        return false;
      }

      // Verificar si el técnico tiene al menos una especialidad requerida 
      const tieneEspecialidadRequerida = tecnico.especialidades.some((esp: any) =>
        especialidadesRequeridasNombres.includes(esp.nombre)
      );
      
      return tieneEspecialidadRequerida;
    });

    console.log('Técnicos filtrados:', this.filteredTecnicos);

    // Ordenar por carga de trabajo
    this.filteredTecnicos.sort((a, b) => a.carga_Actual_Trabajo - b.carga_Actual_Trabajo);

    // Si no hay técnicos disponibles, mostrar mensaje
    if (this.filteredTecnicos.length === 0) {
      this.noti.warning('Sin técnicos', 'No hay técnicos disponibles con las especialidades requeridas');
    }
  }

  /**
   * Obtiene las especialidades que coinciden entre un técnico y el ticket seleccionado
   */
  getEspecialidadesCoincidentes(tecnico: any): string[] {
    if (!this.selectedTicket) return [];
    
    const especialidadesRequeridasNombres = this.selectedTicket.categoria.especialidades.map((esp: any) => esp.nombre);
    
    return tecnico.especialidades
      .filter((esp: any) => especialidadesRequeridasNombres.includes(esp.nombre))
      .map((esp: any) => esp.nombre);
  }

  /**
   * Verifica si un técnico es ideal para el ticket 
   */
  isTecnicoIdeal(tecnico: any): boolean {
    // Un técnico es ideal si tiene carga de trabajo baja (0-1)
    return tecnico.carga_Actual_Trabajo <= 1;
  }

  /**
   * Selecciona un técnico para asignar
   * @param tecnicoId ID del técnico seleccionado
   */
  seleccionarTecnicoParaAsignar(tecnicoId: number): void {
    this.selectedTecnicoId = tecnicoId;
    const tecnicoSeleccionado = this.filteredTecnicos.find(t => t.id === tecnicoId);
    
    if (tecnicoSeleccionado) {
      this.noti.success('Técnico seleccionado', `Se seleccionó a ${tecnicoSeleccionado.nombreCompleto}`);
    }
  }

  /**
   * Crea la asignación manual
   */
  crearAsignacionManual(): void {
    if (!this.selectedTicket) {
      this.noti.error('Error', 'No hay un ticket seleccionado');
      return;
    }

    if (!this.selectedTecnicoId) {
      this.noti.error('Error', 'Debe seleccionar un técnico primero');
      return;
    }

    if (this.asignacionForm.invalid) {
      this.asignacionForm.markAllAsTouched();
      this.noti.error('Formulario inválido', 'Complete la justificación correctamente');
      return;
    }

    this.loading.set(true);

    const payload = {
      ticketId: this.selectedTicket.id,
      usuarioId: this.selectedTecnicoId,
      observaciones: this.asignacionForm.get('justificacion')?.value,
      metodo: "Manual"
    };


    this.asignacionService.crearAsignacionManual(payload).subscribe({
      next: (response: any) => {
        this.loading.set(false);
        this.noti.success(
          'Asignación Manual',
          `Ticket asignado a técnico exitosamente`,
          5000
        );

        //  página de asignación automática
        this.router.navigate(['/automatico']);
      },
      error: (error) => {
        this.loading.set(false);
        console.error('Error:', error);
        this.noti.error('Error', 'No se pudo crear la asignación manual');
      }
    });
  }

  /**
   * Regresar a la vista de tickets
   */
  volverATickets(): void {
    this.showTecnicosTable.set(false);
    this.selectedTicket = null;
    this.filteredTecnicos = [];
    this.selectedTecnicoId = null;
    this.asignacionForm.reset();
  }

  /**
   * Método para prioridad 
   */
  getPrioridadClass(prioridad: string | undefined): string {
    if (!prioridad) {
      return 'estado-default';
    }
    const prioridadLower = prioridad.toLowerCase().trim();
    if (prioridadLower.includes('baja')) return 'estado-baja';
    if (prioridadLower.includes('media')) return 'estado-media';
    if (prioridadLower.includes('alta')) return 'estado-alta';
    return 'estado-default';
  }

  /**
   * Método para disponibilidad 
   */
  getEstadoClass(estado: string | undefined): string {
    if (!estado) {
      return 'estado-default';
    }
    const estadoLower = estado.toLowerCase().trim();
    if (estadoLower.includes('disponible')) return 'estado-disponible';
    if (estadoLower.includes('ocupado')) return 'estado-ocupado';
    if (estadoLower.includes('ausente')) return 'estado-ausente';
    return 'estado-default';
  }

  /**
   * Formatea fecha
   */
  formatDate(dateString: string | Date): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  /**
   * Navega de regreso
   */
  onBack() {
    this.router.navigate(['/automatico']);
  }
}