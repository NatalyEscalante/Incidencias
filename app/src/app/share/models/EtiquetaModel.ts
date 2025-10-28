import { CategoriaModel } from "./CategoriaModel";

export interface EtiquetaModel {
    id: number;
    nombre: string;
    categorias: CategoriaModel[];
}
