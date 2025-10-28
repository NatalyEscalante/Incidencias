import { TicketModel } from "./TicketModel";
import { RolModel } from "./RolModel";
import { NotificacionModel } from "./NotificacionModel";
import { EstadoDisponibilidadModel } from "./EstadoDisponibilidadModel";
import { EspecialidadModel } from "./EspecialidadModel";
import { AsignacionModel } from "./AsignacionModel";


export interface UsuarioModel {
  id: number;
  correo: string;
  nombreCompleto: string;
  ultimoLogin: Date;
  rolId: number;
  rol: RolModel;
  password: string;
  activo: boolean;
  createdAt: Date;
  updatedAt: Date;
  tickets: TicketModel[];
  notificaciones: NotificacionModel[];
  // Campos de Tecnico
  carga_Actual_Trabajo?: number;
  estado_DisponibilidadId?: number;
  estado?: EstadoDisponibilidadModel;
  especialidades: EspecialidadModel[];
  asignaciones: AsignacionModel[];
}