export interface AsignacionEjecutadaResponse {
    success: boolean;
    message: string;
    asignacionesRealizadas: number;
    detalles?: Array<{
        ticketId: number;
        tecnicoId: number;
        reglaId: number;
        estado: string;
    }>;
}