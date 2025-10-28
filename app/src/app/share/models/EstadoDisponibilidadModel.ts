import { UsuarioModel } from "./UsuarioModel";
export interface EstadoDisponibilidadModel {
    id: number;
    estado: string;
    usuarios: UsuarioModel[];
}