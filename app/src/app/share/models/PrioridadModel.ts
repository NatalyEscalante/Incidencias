import { TicketModel} from "./TicketModel"
import {ReglasAutoTriageModel } from "./ReglasAutoTriageModel";

export interface PrioridadModel {
    id: number;
    prioridad: string;
    tickets: TicketModel[];
    reglas: ReglasAutoTriageModel[];
}