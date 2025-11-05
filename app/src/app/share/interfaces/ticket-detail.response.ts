export interface TicketDetailResponse {
    // Ticket
    id: number;
    titulo: string;
    descripcion: string;
    fechaCreacion: Date;
    fechaCierre?: Date;
    estado: string;
    prioridad: string;

    // Usuario
    usuarioSolicitante: {
        id: number;
        nombreCompleto: string;
        correo: string;
    };

    // Categoría y SLA
    categoria: string;
    sla: {
        tiempoRespuesta: string;
        tiempoResolucion: string;
    };
    diasResolucion: number | null;

    // SLA
    slaRespuesta: {
        fechaLimite: Date;
        fechaReal: Date | null;
        cumplio: boolean | null;
        estado: string;
    };
    slaResolucion: {
        fechaLimite: Date;
        fechaReal: Date | null;
        cumplio: boolean | null;
        estado: string;
    };

    // Historial
    historial: {
        id: number;
        estado: string;
        fechaCambio: Date;
        imagenes: {
            id: number;
            ruta: string;
        }[];
    }[];

    // Asignaciones
    asignaciones: {
        id: number;
        tecnico: string;
        metodo: string;
        fechaAsignacion: Date;
        observaciones?: string;
    }[];

    // Valoraciones
    valoraciones: {
        comentario?: string;
        valoracion: number;
        fecha: Date;
    }[];
}