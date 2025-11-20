import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { FormBuilder, FormGroup, Validators, FormArray, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoriaService } from '../../share/service/api/categoria.service';
import { EspecialidadService } from '../../share/service/api/especialidad.service';
import { EtiquetaService } from '../../share/service/api/etiqueta.service';
import { SLAService } from '../../share/service/api/sla.service';
import { NotificationService } from '../../share/service/app/notification.service';
import { CategoriaModel } from '../../share/models/CategoriaModel';
import { EspecialidadModel } from '../../share/models/EspecialidadModel';
import { EtiquetaModel } from '../../share/models/EtiquetaModel';
import { SLAModel } from '../../share/models/SLAModel';

@Component({
  selector: 'app-categoria-form',
  standalone: false,
  templateUrl: './categoria-form.html',
  styleUrl: './categoria-form.css'
})
export class CategoriaForm implements OnInit, OnDestroy {
  // Subject para controlar la destrucción de suscripciones y evitar memory leaks
  private destroy$ = new Subject<void>();

  // Título del formulario, id del videojuego y bandera de creación/actualización
  titleForm = 'Crear';
  idCategoria: number | null = null;
  isCreate = true;

  //Listado de especialidades y etiquetas y sla
  especialidadesList = signal<EspecialidadModel[]>([]);
  etiquetasList = signal<EtiquetaModel[]>([]);
  slaList = signal<SLAModel[]>([]);

  // Formulario reactivo
  categoriaForm!: FormGroup;
  useCustomSLA = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private categoriaService: CategoriaService,
    private especialidadService: EspecialidadService,
    private etiquetaService: EtiquetaService,
    private slaService: SLAService,
    private noti: NotificationService
  ) { }

  /**
   * Ciclo de vida OnInit: inicializa el formulario, carga listas y verifica si es actualización
   */
  ngOnInit(): void {
    this.initForm(); // Inicializa formulario reactivo
    this.loadEspecialidades();  // Carga lista de Especialidades
    this.loadEtiquetas(); //Carga lista de Etiquetas
    this.loadSLAs(); //Carga lista de sla

    // Suscripción a parámetros de ruta para determinar si es crear o actualizar
    this.route.params.subscribe((params) => {
      this.idCategoria = params['id'] ?? null;
      this.isCreate = this.idCategoria === null;
      this.titleForm = this.isCreate ? 'Crear' : 'Actualizar';

      //Si hay id obtengo la categoría a actualizar
      if (this.idCategoria) {
        this.categoriaService.getById(this.idCategoria).subscribe((data) => this.patchFormValues(data));
      }
    });

  }

  /**
   * Inicializa el formulario reactivo con validaciones
   */
  private initForm(): void {
    this.categoriaForm = this.fb.group({
      id: [null],
      nombre: [null, [Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]],
      slaId: [null, Validators.required],
      tiempoRespuestaCustom: [null],
      tiempoResolucionCustom: [null],
      etiquetas: [null, Validators.required],
      especialidades: [null, Validators.required]
    });
  }


  /**
   * Carga las especialidades desde el API y actualiza la signal
   */
  private loadEspecialidades() {
    this.especialidadService.get().pipe(takeUntil(this.destroy$))
      .subscribe(data => this.especialidadesList.set(data.filter(item => item.activo)));
  }

  /**
   * Carga las etiquetas desde el API y actualiza la signal
   */
  private loadEtiquetas() {
    this.etiquetaService.get().pipe(takeUntil(this.destroy$))
      .subscribe(data => this.etiquetasList.set(data));
  }

  /**
     * Carga los sla desde el API y actualiza la signal
     */
  private loadSLAs() {
    this.slaService.get().pipe(takeUntil(this.destroy$))
      .subscribe(data => this.slaList.set(data));
  }

  /**
   * Carga los valores del formulario con los datos de categoria a actualizar
   * @param data Datos del videojuego obtenidos del API
   */
  private patchFormValues(data: CategoriaModel) {
    this.categoriaForm.patchValue({
      id: data.id,
      nombre: data.nombre,
      slaId: data.slaId,
      etiquetas: data.etiquetas.map(e => e.id),
      especialidades: data.especialidades.map(e => e.id)
    });

  }


  extractMinutes(timeString: string): number {
    if (!timeString) return 0;

    if (timeString.includes(':')) {
      const [hours, minutes] = timeString.split(':').map(Number);
      return hours * 60 + minutes;
    }

    return parseInt(timeString) || 0;
  }

  formatTime(minutes: number): string {
    if (!minutes) return 'No definido';

    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours > 0) {
      return `${hours} ${hours === 1 ? 'hora' : 'horas'}${mins > 0 ? ` y ${mins} minutos` : ''}`;
    } else if (mins > 0) {
      return `${mins} ${mins === 1 ? 'minuto' : 'minutos'}`;
    } else {
      return 'Inmediato';
    }
  }

  /**
   * Envía el formulario: valida, carga y guarda/actualiza la categoria
   */
  submitCategoria() {
    this.categoriaForm.markAllAsTouched();

    if (this.categoriaForm.invalid) {
      this.noti.error('Formulario Inválido', 'Revise los campos marcados.', 5000);
      return;
    }

    // Prepara payloads para el API
    const formValue = this.categoriaForm.value;

    const payloadEtiquetas = formValue.etiquetas?.map((id: number) => ({ id })) ?? [];
    const payloadEspecialidades = formValue.especialidades?.map((id: number) => ({ id })) ?? [];
    const payloadSla = formValue.sla?.map((id: number) => ({ id })) ?? [];

    // Función interna para guardar o actualizar videojuego
    const payload = {
      ...formValue,
      etiquetas: payloadEtiquetas,
      especialidades: payloadEspecialidades,
      sla: payloadSla
    };

    const request$ = this.isCreate
      ? this.categoriaService.create(payload)
      : this.categoriaService.update(payload);

    request$.pipe(takeUntil(this.destroy$)).subscribe(data => {
      this.noti.success(
        this.isCreate ? 'Crear Categoría' : 'Actualizar Categoría',
        `Categoría ${data.nombre} ${this.isCreate ? 'creada' : 'actualizada'}`,
        5000,
        '/categoria-admin'
      );
    });
  }

  /**
     * Resetea el formulario a valores iniciales
     */
  onReset() {
    this.categoriaForm.reset();
  }

  /**
   * Navega de regreso a la lista de videojuegos
   */
  onBack() {
    this.router.navigate(['/categoria-admin']);
  }

  /**
   * Ciclo de vida OnDestroy: limpia suscripciones
   */
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}