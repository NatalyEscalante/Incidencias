import {SLAModel} from "./SLAModel"
import { EtiquetaModel } from "./EtiquetaModel";
import { EspecialidadModel } from "./EspecialidadModel";
import { TicketModel } from "./TicketModel";
import { ReglasAutoTriageModel } from "./ReglasAutoTriageModel";

export interface CategoriaModel {
    id: number;
    nombre: string;
    slaId: number;
    sla: SLAModel;
    etiquetas: EtiquetaModel[];
    especialidades: EspecialidadModel[];
    tickets: TicketModel[];
    reglas: ReglasAutoTriageModel[];
}