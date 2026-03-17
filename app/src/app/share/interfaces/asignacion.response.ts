export interface AsignacionAutomaticaResponse {
    success: boolean;
    data: {
        reglasConfiguradas: number;
        ticketsPendientes: number;
        reglas: {
            nombre: string;
            categoria: string;
            prioridad: string;
            especialidad: string;
            cargaMaxima: number | null;
            ordenPrioridad: number;
            tecnicosDisponibles: number;
        }[];
        tickets: {
            id: number;
            titulo: string;
            categoria: string;
            prioridad: string;
            fechaCreacion: Date;
            fechaLimite: Date;
            tiempoRestanteSLA: number;
            valorPrioridad: number;
            puntaje: string;
        }[];
        asignacionesPropuestas: {
            ticket: string;
            categoria: string;
            prioridad: string;
            puntaje: string;
            tiempoRestanteSLA?: string;
            tecnicoAsignado?: string;
            tecnicoId?: number;
            ticketId?: number;
            reglaId?: number;
            especialidad?: string;
            cargaTrabajo?: number | null;
            disponibilidad?: string | null;
            reglaAplicada?: string;
            estado: string;
            mensaje?: string;
        }[];
    };
}