import { UsuarioModel } from "./UsuarioModel";
import { EventoModel } from "./EventoModel";

export interface NotificacionModel {
    id: number;
    usuarioId: number;
    usuario: UsuarioModel;
    eventoId: number;
    evento: EventoModel;
    estado: string;
    fecha: Date;
}