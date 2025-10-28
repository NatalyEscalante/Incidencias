import { CategoriaModel } from "./CategoriaModel";

export interface SLAModel {
    id: number;
    tiempoRespuesta: string;
    tiempoResolucion: string;
    categorias: CategoriaModel[];
}