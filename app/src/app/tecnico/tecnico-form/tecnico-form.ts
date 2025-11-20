import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { FormBuilder, FormGroup, Validators, FormArray, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TecnicoService } from '../../share/service/api/Tecnico.service';
import { EspecialidadService } from '../../share/service/api/especialidad.service';
import { NotificationService } from '../../share/service/app/notification.service';
import { UsuarioModel } from '../../share/models/UsuarioModel';
import { EspecialidadModel } from '../../share/models/EspecialidadModel';
import { EstadoDisponibilidadModel } from '../../share/models/EstadoDisponibilidadModel';
import { EstadoService } from '../../share/service/api/estado.service';
@Component({
  selector: 'app-tecnico-form',
  standalone: false,
  templateUrl: './tecnico-form.html',
  styleUrl: './tecnico-form.css'
})
export class TecnicoForm implements OnInit, OnDestroy {

  // Subject para controlar la destrucción de suscripciones y evitar memory leaks
  private destroy$ = new Subject<void>();

  // Título del formulario, id del videojuego y bandera de creación/actualización
  titleForm = 'Crear';
  idTecnico: number | null = null;
  isCreate = true;

  //Listado de especialidades 
  especialidadesList = signal<EspecialidadModel[]>([]);
  estadoList = signal<EstadoDisponibilidadModel[]>([]);
  // Formulario reactivo
  tecnicoForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private tecnicoService: TecnicoService,
    private especialidadService: EspecialidadService,
    private estadoService: EstadoService,
    private noti: NotificationService
  ) { }

  /**
* Ciclo de vida OnInit: inicializa el formulario, carga listas y verifica si es actualización
*/
  ngOnInit(): void {
    this.initForm(); // Inicializa formulario reactivo
    this.loadEspecialidades();  // Carga lista de Especialidades
    this.loadEstado(); //Carga lista de disponibilidad
    // Suscripción a parámetros de ruta para determinar si es crear o actualizar
    this.route.params.subscribe((params) => {
      this.idTecnico = params['id'] ?? null;
      this.isCreate = this.idTecnico === null;
      this.titleForm = this.isCreate ? 'Crear' : 'Actualizar';

      //Si hay id obtengo la categoría a actualizar
      if (this.idTecnico) {
        this.tecnicoService.getById(this.idTecnico).subscribe((data) => this.patchFormValues(data));
      }
    });

  }

  /**
   * Inicializa el formulario reactivo con validaciones
   */

private initForm(): void {
  this.tecnicoForm = this.fb.group({
    id: [null],
    nombreCompleto: [null, [Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]],
    correo: [null, [Validators.required, Validators.email,Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/) ]],
    cargaTrabajo: [{ value: 0, disabled: true }],
    estado_DisponibilidadId: [null, Validators.required], 
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

  private loadEstado() {
    this.estadoService.get().pipe(takeUntil(this.destroy$))
      .subscribe(data => this.estadoList.set(data));
  }


  /**
     * Carga los valores del formulario con los datos de categoria a actualizar
     * @param data Datos del videojuego obtenidos del API
     */
  private patchFormValues(data: UsuarioModel) {
    this.tecnicoForm.patchValue({
      id: data.id,
      correo: data.correo,
      nombreCompleto: data.nombreCompleto,
      cargaTrabajo: data.carga_Actual_Trabajo || 0, 
      estado_DisponibilidadId: data.estado_DisponibilidadId,
      especialidades: data.especialidades.map(e => e.id)
    });
  }

  /**
* Envía el formulario: valida, carga y guarda/actualiza la categoria
*/
  submitCategoria() {
    this.tecnicoForm.markAllAsTouched();

    if (this.tecnicoForm.invalid) {
      this.noti.error('Formulario Inválido', 'Revise los campos marcados.', 5000);
      return;
    }

    // Prepara payloads para el API
    const formValue = this.tecnicoForm.value;

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
      ? this.tecnicoService.create(payload)
      : this.tecnicoService.update(payload);

    request$.pipe(takeUntil(this.destroy$)).subscribe(data => {
      this.noti.success(
        this.isCreate ? 'Crear Técnico' : 'Actualizar Técnico',
        `Técnico ${data.nombreCompleto} ${this.isCreate ? 'creada' : 'actualizada'}`,
        3000,
        '/tecnico-admin'
      );
    });
  }

  /**
     * Resetea el formulario a valores iniciales
     */
  onReset() {
    this.tecnicoForm.reset();
  }

  /**
   * Navega de regreso a la lista de videojuegos
   */
  onBack() {
    this.router.navigate(['/tecnico-admin']);
  }

  /**
   * Ciclo de vida OnDestroy: limpia suscripciones
   */
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
