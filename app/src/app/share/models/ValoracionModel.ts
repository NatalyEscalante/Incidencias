import { TicketModel } from "./TicketModel";

export interface ValoracionModel {
    id: number;
    ticketId: number;
    ticket: TicketModel;
    comentario?: string;
    valoracion: number;
    fecha: Date;
}