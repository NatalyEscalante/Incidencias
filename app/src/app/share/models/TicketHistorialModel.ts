import { TicketModel } from "./TicketModel";
import { EstadoTicketModel } from "./EstadoTicketModel";
import { TicketImagenModel } from "./TicketImagenModel";

export interface TicketHistorialModel {
    id: number;
    ticketId: number;
    ticket: TicketModel;
    estado_AnteriorId: number;
    estadoA: EstadoTicketModel;
    updatedAt: Date;
    imagenes: TicketImagenModel[];
}