import { TicketHistorialModel } from "./TicketHistorialModel";

export interface TicketImagenModel {
    id: number;
    ticketHId: number;
    ticketHistorial: TicketHistorialModel;
    ruta: string;
}