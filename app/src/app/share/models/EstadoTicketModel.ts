import { TicketModel } from "./TicketModel";
import { TicketHistorialModel } from "./TicketHistorialModel";

export interface EstadoTicketModel {
  id: number;
  estado: string;
  tickets: TicketModel[];
  historias: TicketHistorialModel[];
}