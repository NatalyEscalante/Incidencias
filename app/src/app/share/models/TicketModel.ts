import { UsuarioModel } from "./UsuarioModel";
import { CategoriaModel } from "./CategoriaModel";
import { EstadoTicketModel } from "./EstadoTicketModel";
import { PrioridadModel } from "./PrioridadModel";
import { TicketHistorialModel } from "./TicketHistorialModel";
import { AsignacionModel } from "./AsignacionModel";
import { ValoracionModel } from "./ValoracionModel";

export interface TicketModel {
    id: number;
    titulo: string;
    descripcion: string;
    usuarioId: number;
    usuario: UsuarioModel;
    categoriaId: number;
    categoria: CategoriaModel;
    estadoId: number;
    estadoTicket: EstadoTicketModel;
    prioridadId: number;
    prioridad: PrioridadModel;
    createdAt: Date;
    updatedAt: Date;
    fechaCierre?: Date;
    historias: TicketHistorialModel[];
    asignaciones: AsignacionModel[];
    valoraciones: ValoracionModel[];
}