import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '../../share/service/app/notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EtiquetaModel } from '../../share/models/EtiquetaModel';
import { PrioridadModel } from '../../share/models/PrioridadModel';
import { TicketService } from '../../share/service/api/Ticket.service';
import { EtiquetaService } from '../../share/service/api/etiqueta.service';
import { PrioridadService } from '../../share/service/api/prioridad.service';
import { CategoriaService } from '../../share/service/api/categoria.service';
import { CategoriaModel } from '../../share/models/CategoriaModel';
import { FileUploadService } from '../../share/service/api/file-upload.service';

@Component({
  selector: 'app-ticket-form',
  standalone: false,
  templateUrl: './ticket-form.html',
  styleUrl: './ticket-form.css'
})
export class TicketForm implements OnInit, OnDestroy {

  //Signal - Respuesta del API
  datos = signal<any>({
    usuario: null,
    totalTickets: 0,
    tickets: []
  });
  // Subject para controlar la destrucción de suscripciones y evitar memory leaks
  private destroy$ = new Subject<void>();

  // Título del formulario
  titleForm = 'Crear Ticket';

  //Listados 
  etiquetasList = signal<EtiquetaModel[]>([]);
  prioridadList = signal<PrioridadModel[]>([]);
  categoriasList = signal<CategoriaModel[]>([]);
  
  // Formulario reactivo
  ticketForm!: FormGroup;

  // Variables para gestión de imagen
  currentFile?: File;
  preview = '';
  nameImage = 'image-not-found.jpg';

  // Usuario 
  private usuarioId = 3; 

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private ticketService: TicketService,
    private etiquetaService: EtiquetaService,
    private prioridadService: PrioridadService,
    private categoriaService: CategoriaService,
    private uploadService: FileUploadService,
    private noti: NotificationService
  ) { 
    this.listTickets();
  }

//Listar todos los Tickets del API
  listTickets() {
    const usuarioRol = this.usuarioId;

    this.ticketService.getTicketsByRol(usuarioRol).subscribe({
      next: (respuesta: any) => {
        console.log('Respuesta completa:', respuesta);
        this.datos.set(respuesta);
      }
    });
  }

/**
* Ciclo de vida OnInit: inicializa el formulario, carga listas y verifica si es actualización
*/
  ngOnInit(): void {
    this.initForm();
    this.loadEtiquetas();
    this.loadPrioridad();
    this.loadCategorias();

    //cambios en la etiqueta para mostrar la categoría automáticamente
    this.ticketForm.get('etiquetaId')?.valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(etiquetaId => {
      this.onEtiquetaChange(etiquetaId);
    });
  }

  /**
   * Inicializa el formulario reactivo con validaciones
   */
  private initForm(): void {
    this.ticketForm = this.fb.group({
      id: [null],
      titulo: [null, [Validators.required, Validators.minLength(5)]],
      descripcion: [null, [Validators.required, Validators.minLength(10)]],
      prioridadId: [null, Validators.required],
      etiquetaId: [null, Validators.required],
      categoriaId: [{ value: null, disabled: true }],
      categoriaNombre: [{ value: '', disabled: true }],
      usuarioId: [this.usuarioId],
      fechaCreacion: [{ value: new Date().toISOString().split('T')[0], disabled: true }],
      estado: [{ value: 'Pendiente', disabled: true }],
      imagen: [this.nameImage]
    });
  }

  /**
  * Carga las etiquetas desde el API y actualiza la signal
  */
  private loadEtiquetas() {
    this.etiquetaService.get().pipe(takeUntil(this.destroy$))
      .subscribe(data => {this.etiquetasList.set(data);});
  }

  private onEtiquetaChange(etiquetaId: number) {
  //Verifica el idEtiqueta seleccionada por el user
  if (etiquetaId) {
    //Busca relación entre la lista de etiqueta con el idEtiqueta
    const etiquetaSeleccionada = this.etiquetasList().find(e => e.id === etiquetaId);
    console.log('Etiqueta encontrada:', etiquetaSeleccionada);
    
    //Verifica si existe la etiqueta y si es mayor a 0
    if (etiquetaSeleccionada) {
      if (etiquetaSeleccionada.categorias && etiquetaSeleccionada.categorias.length > 0) {
        //Obtiene la posición del array de categoria del api etiqueta
        const categoriaAsociada = etiquetaSeleccionada.categorias[0];
        console.log('Categoría asociada encontrada:', categoriaAsociada);
        
        if (categoriaAsociada) {
          //Busca la relacionn de el listado categorias con la categoria encontrada en etiqueta 
          const categoriaCompleta = this.categoriasList().find(c => c.id === categoriaAsociada.id);

          /*Agrega los campo al form y se utiliza patchValue, permitiendo solo actualizar los campos que
          se quieren actualizar especificamente*/
          this.ticketForm.patchValue({
            categoriaId: categoriaAsociada.id,
            categoriaNombre: categoriaCompleta?.nombre || 'Categoría encontrada'
          });
          console.log('Categoría asignada:', categoriaAsociada.id, categoriaCompleta?.nombre);
        }
      } else {
        console.log('La etiqueta no tiene categorías asociadas');
        this.ticketForm.patchValue({
          categoriaId: null,
          categoriaNombre: 'No hay categoría asociada'
        });
      }
    }
  } else {
    this.ticketForm.patchValue({
      categoriaId: null,
      categoriaNombre: ''
    });
  }
}

/**
  * Carga las prioridades desde el API y actualiza la signal
  */
  private loadPrioridad() {
    this.prioridadService.get().pipe(takeUntil(this.destroy$))
      .subscribe(data => {this.prioridadList.set(data);});
  }

  /**
  * Carga las categorias desde el API y actualiza la signal
  */
  private loadCategorias() {
    this.categoriaService.get().pipe(takeUntil(this.destroy$))
      .subscribe(data => {this.categoriasList.set(data);});
  }

  // Gestión de archivos de imagen
  selectFile(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) {
      this.currentFile = input.files[0];
      this.nameImage = this.currentFile.name;
      const reader = new FileReader();
      reader.onload = e => (this.preview = e.target?.result as string);
      reader.readAsDataURL(this.currentFile);
    } else {
      this.currentFile = undefined;
      this.preview = '';
      this.nameImage = 'image-not-found.jpg';
    }
  }

  //Envía los campos al api para hacer el insert 
  submitTicket() {
  this.ticketForm.markAllAsTouched();

  if (this.ticketForm.invalid) {
    this.noti.error('Formulario Inválido', 'Revise los campos marcados.', 5000);
    return;
  }

  // Prepara payloads para el API
  const formValue = this.ticketForm.getRawValue();
  
  if (!formValue.categoriaId) {
    this.noti.error('Error', 'Seleccione una etiqueta válida para asignar la categoría.', 5000);
    return;
  }

  // Preparar el payload
  const saveTicket = (imageFileName: string = '') => {
    const payload: any = {
      titulo: formValue.titulo,
      descripcion: formValue.descripcion,
      usuarioId: formValue.usuarioId,
      categoriaId: formValue.categoriaId,
      prioridadId: formValue.prioridadId,
      imagenes: imageFileName ? [imageFileName] : [] 
    };

    this.ticketService.create(payload as any).pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => {
        this.noti.success(
          'Crear Ticket',
          `Ticket "${data.titulo}" creado exitosamente`,
          3000,
          '/ticket-admin'
        );
      },
      error: (error) => {
        this.noti.error('Error', 'No se pudo crear el ticket.', 5000);
      }
    });
  };

  //Subir imagen primero usando el servicio de upload
  if (this.currentFile) {
    
    this.uploadService.upload(this.currentFile, null)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any) => {
          // nombre transformado por el middleware
          saveTicket(data.fileName);
        },
        error: (error: any) => {
          // Crear ticket sin imagen si falla la subida
          saveTicket();
        }
      });
  } else {
    // Crear ticket sin imagen
    saveTicket();
  }
}

  onReset() {
    this.ticketForm.reset({
      usuarioId: this.usuarioId,
      fechaCreacion: new Date().toISOString().split('T')[0],
      estado: 'Pendiente',
      imagen: 'image-not-found.jpg'
    });
    this.preview = '';
    this.currentFile = undefined;
    this.nameImage = 'image-not-found.jpg';
  }

  onBack() {
    this.router.navigate(['/ticket-admin']);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}