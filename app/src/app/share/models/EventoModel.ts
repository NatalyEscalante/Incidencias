import { NotificacionModel } from "./NotificacionModel";

export interface EventoModel {
    id: number;
    evento: string;
    notificaciones: NotificacionModel[];
}