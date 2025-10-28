import { CategoriaModel } from "./CategoriaModel";
import {UsuarioModel } from "./UsuarioModel";
import {ReglasAutoTriageModel } from "./ReglasAutoTriageModel";

export interface EspecialidadModel {
    id: number;
    nombre: string;
    descripcion: string;
    activo: boolean;
    createdAt: Date;
    updatedAt: Date;
    categorias: CategoriaModel[];
    usuarios: UsuarioModel[];
    reglas: ReglasAutoTriageModel[];
}