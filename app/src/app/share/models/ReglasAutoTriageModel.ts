import {CategoriaModel} from "./CategoriaModel"
import {PrioridadModel } from "./PrioridadModel"
import { EspecialidadModel } from "./EspecialidadModel";
import { AsignacionModel } from "./AsignacionModel";


export interface ReglasAutoTriageModel {
    id: number;
    nombre: string;
    categoriaId: number;
    categoria: CategoriaModel;
    prioridadId?: number;
    prioridad?: PrioridadModel;
    especialidadId: number;
    especialidad: EspecialidadModel;
    cargaMaximaTecnico?: number;
    ordenPrioridad: number;
    activo: boolean;
    puntaje: number; 
    createdAt: Date;
    updatedAt: Date;
    asignaciones: AsignacionModel[];
}