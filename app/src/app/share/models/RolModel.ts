import { UsuarioModel } from "./UsuarioModel";
export interface RolModel {
  id: number;
  nombre: string;
  usuarios: UsuarioModel[];
}