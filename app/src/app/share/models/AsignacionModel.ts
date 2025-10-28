import {ReglasAutoTriageModel} from "./ReglasAutoTriageModel";
import {TicketModel} from "./TicketModel";
import{UsuarioModel} from "./UsuarioModel";

export interface AsignacionModel {
    id: number;
    metodo: string;
    fechaAsignacion: Date;
    reglaId?: number;
    regla?: ReglasAutoTriageModel;
    ticketId: number;
    ticket: TicketModel;
    usuarioId: number;
    usuario: UsuarioModel;
    observaciones: string;
}