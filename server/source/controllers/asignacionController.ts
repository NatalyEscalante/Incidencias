import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "../../generated/prisma";

export class asignacionController {
    prisma = new PrismaClient();

    get = async () => {
        // 1. Lista de Reglas de AutoTriage
        const reglas = await this.prisma.reglasAutoTriage.findMany({
            where: { activo: true },
            orderBy: { ordenPrioridad: "asc" },
            include: {
                categoria: { select: { id: true, nombre: true } },
                prioridad: { select: { id: true, prioridad: true } },
                especialidad: {
                    select: {
                        id: true,
                        nombre: true,
                        usuarios: {
                            where: {
                                activo: true,
                                rol: { nombre: "Técnico" }
                            },
                            select: {
                                id: true,
                                nombreCompleto: true,
                                carga_Actual_Trabajo: true,
                                estado: true,
                            }
                        }
                    }
                }
            }
        });

        // 2. Lista de Tickets pendientes sin asignar
        const ticketsPendientes = await this.prisma.ticket.findMany({
            where: {
                estadoTicket: { estado: "Pendiente" },
                asignaciones: { none: {} }
            },
            include: {
                usuario: { select: { id: true, nombreCompleto: true, correo: true } },
                categoria: { include: { sla: true } },
                prioridad: true,
                estadoTicket: true,
            }
        });

        if (ticketsPendientes.length === 0) {
            return { reglas, ticketsPendientes: [], ticketsOrdenados: [], asignacionesPropuestas: [] };
        }

        // 3. FUNCIONES PARA CALCULAR EL SLA
        const convertirTiempoSLA = (tiempo: string): number => {
            const [horas, minutos, segundos] = tiempo.split(':').map(Number);
            return horas + (minutos / 60) + (segundos / 3600);
        };

        const calcularFechaLimite = (fechaInicio: Date, tiempoSLA: string): Date => {
            const horasSLA = convertirTiempoSLA(tiempoSLA);
            const fechaLimite = new Date(fechaInicio);

            const horas = Math.floor(horasSLA);
            const minutos = Math.round((horasSLA - horas) * 60);

            fechaLimite.setHours(fechaLimite.getHours() + horas);
            fechaLimite.setMinutes(fechaLimite.getMinutes() + minutos);

            return fechaLimite;
        };

        const calcularTiempoRestante = (fechaLimite: Date): number => {
            const fechaActual = new Date("2025-11-24T18:45:00.000Z");

            const restaMinutos = fechaLimite.getTime() - fechaActual.getTime();

            const horasRestantes = restaMinutos / (1000 * 60 * 60);

            return horasRestantes;
        };

        // 4. Iterar cada ticket para carcular el puntaje
        const ticketsConPuntaje = ticketsPendientes.map(ticket => {
            // Calcular tiempo restante SLA
            const fechaLimite = calcularFechaLimite(ticket.createdAt, ticket.categoria.sla.tiempoResolucion);
            const tiempoRestante = calcularTiempoRestante(fechaLimite);

            let valorPrioridad = 3;
            if (ticket.prioridad.prioridad === 'Baja') valorPrioridad = 1;
            else if (ticket.prioridad.prioridad === 'Media') valorPrioridad = 2;

            // Calcular puntaje 
            const puntaje = (valorPrioridad * 1000) - tiempoRestante;
            const puntajeRedondeado = Math.round(puntaje * 100) / 100;
            return {
                ...ticket,
                fechaLimiteSLA: fechaLimite,
                tiempoRestanteSLA: tiempoRestante,
                valorPrioridad,
                puntaje: puntajeRedondeado
            };
        });

        // 5. ORDENAR TICKETS POR PUNTAJE 
        const ticketsOrdenados = ticketsConPuntaje.sort((a, b) => b.puntaje - a.puntaje);

        // 6. ASIGNACIÓN AUTOMÁTICA
        const asignacionesPropuestas = [];
        //va a crear una coloeccion de tecnicos ocupados 
        /**Se utiliza set es un metodo de listado para guardar una coleccion unicos y 
         * busqueda instantane, con la ayuda de la función principales del has que verifica si se encuenta
         * en la lista 
         */
        const tecnicosAsignados = new Set();

        for (const ticket of ticketsOrdenados) {
            // Buca y valida las condiciones de las reglas con el ticket
            const reglaAplicable = reglas.find(regla =>
                regla.categoria.id === ticket.categoriaId &&
                (!regla.prioridad || regla.prioridad.id === ticket.prioridadId)
            );

            if (!reglaAplicable) {
                asignacionesPropuestas.push({
                    ticket: ticket.titulo,
                    categoria: ticket.categoria.nombre,
                    prioridad: ticket.prioridad.prioridad,
                    puntaje: ticket.puntaje,
                    estado: "No existe una regla establecida",
                    mensaje: "No se encontró regla aplicable"
                });
                continue;
            }

            // Buscar técnico disponible y con capacidad en base a las reglas del api
            const tecnicosDisponibles = reglaAplicable.especialidad.usuarios.filter(tecnico => {
                const cargaActual = tecnico.carga_Actual_Trabajo || 0;
                const cargaMaxima = reglaAplicable.cargaMaximaTecnico || 8;
                const disponibilidad = tecnico.estado?.estado || 'Disponible'
                //Verifica si un tecnico esta en la lista 
                return !tecnicosAsignados.has(tecnico.id) && cargaActual < cargaMaxima && disponibilidad === 'Disponible';
            });

            if (tecnicosDisponibles.length > 0) {
                // Asignar al primer técnico disponible
                const tecnicoAsignado = tecnicosDisponibles[0];
                tecnicosAsignados.add(tecnicoAsignado.id);

                asignacionesPropuestas.push({
                    ticket: ticket.titulo,
                    categoria: ticket.categoria.nombre,
                    prioridad: ticket.prioridad.prioridad,
                    puntaje: ticket.puntaje.toFixed(2),
                    tiempoRestanteSLA: ticket.tiempoRestanteSLA.toFixed(2) + " horas",

                    tecnicoAsignado: tecnicoAsignado.nombreCompleto,
                    tecnicoId: tecnicoAsignado.id,
                    ticketId: ticket.id,
                    reglaId: reglaAplicable.id,
                    especialidad: reglaAplicable.especialidad.nombre,
                    cargaTrabajo: tecnicoAsignado.carga_Actual_Trabajo,
                    disponibilidad: tecnicoAsignado.estado?.estado,
                    reglaAplicada: reglaAplicable.nombre,
                    estado: "Asignar"
                });

            } else {
                asignacionesPropuestas.push({
                    ticket: ticket.titulo,
                    categoria: ticket.categoria.nombre,
                    prioridad: ticket.prioridad.prioridad,
                    puntaje: ticket.puntaje.toFixed(2),
                    estado: "Asignar",
                    mensaje: "No hay técnicos disponibles para esta especialidad"
                });
            }
        }
        return { reglas, ticketsPendientes, ticketsOrdenados, asignacionesPropuestas };
    }

    // ENDPOINT 1: Lista para mostrar en la vista
    getPropuestas = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const { reglas, ticketsPendientes, ticketsOrdenados, asignacionesPropuestas } =
                await this.get();

            response.json({
                success: true,
                data: {
                    reglasConfiguradas: reglas.length,
                    ticketsPendientes: ticketsPendientes.length,
                    reglas: reglas.map(regla => ({
                        nombre: regla.nombre,
                        categoria: regla.categoria.nombre,
                        prioridad: regla.prioridad?.prioridad || "Todas",
                        especialidad: regla.especialidad.nombre,
                        cargaMaxima: regla.cargaMaximaTecnico,
                        ordenPrioridad: regla.ordenPrioridad,
                        tecnicosDisponibles: regla.especialidad.usuarios.length
                    })),
                    tickets: ticketsOrdenados.map(ticket => ({
                        id: ticket.id,
                        titulo: ticket.titulo,
                        categoria: ticket.categoria.nombre,
                        prioridad: ticket.prioridad.prioridad,
                        fechaCreacion: ticket.createdAt,
                        fechaLimite: ticket.fechaLimiteSLA,
                        tiempoRestanteSLA: ticket.tiempoRestanteSLA,
                        valorPrioridad: ticket.valorPrioridad,
                        puntaje: ticket.puntaje.toFixed(2)
                    })),
                    asignacionesPropuestas: asignacionesPropuestas
                }
            });

        } catch (error) {
            console.error('Error:', error);
            next(error);
        }
    };

    // ENDPOINT 2: Crea la asignacion post 
    ejecutarAsignacionAutomatica = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const { asignacionesPropuestas } = await this.get();

            const resultados = [];

            for (const propuesta of asignacionesPropuestas) {
                if (propuesta.estado === "Asignar" && propuesta.tecnicoId && propuesta.ticketId && propuesta.reglaId) {
                    try {
                        await this.crearAsignacionAutomatica(
                            propuesta.ticketId,
                            propuesta.tecnicoId,
                            propuesta.reglaId,
                            propuesta.reglaAplicada
                        );

                        resultados.push({
                            ticket: propuesta.ticket,
                            tecnico: propuesta.tecnicoAsignado,
                            estado: "ASIGNADO"
                        });
                    } catch (error) {
                        resultados.push({
                            ticket: propuesta.ticket,
                            estado: "ERROR",
                        });
                    }
                }
            }

            response.json({
                success: true,
                message: "Asignación automática ejecutada",
                asignacionesRealizadas: resultados.filter(r => r.estado === "ASIGNADO").length,
                resultados: resultados
            });

        } catch (error) {
            next(error);
        }
    };

    private crearAsignacionAutomatica = async (ticketId: number, tecnicoId: number, reglaId: number, regla: string) => {
        //Caja de seguridad
        return await this.prisma.$transaction(async (prisma) => {

            // 1. Crear la asignación
            await prisma.asignacion.create({
                data: {
                    metodo: "Automática",
                    reglaId: reglaId,
                    ticketId: ticketId,
                    observaciones: "Asignado por regla " + regla,
                    usuarioId: tecnicoId,
                }
            });

            // 2. Actualizar estado del ticket a asignado
            await prisma.ticket.update({
                where: { id: ticketId },
                data: { estadoId: 2 }
            });

            // 3. Crear historial del ticket
            await prisma.ticketHistorial.create({
                data: {
                    ticketId: ticketId,
                    estado_AnteriorId: 2,
                },
            });

            // 4. Actualizar carga del técnico
            await prisma.usuario.update({
                where: { id: tecnicoId },
                data: {
                    carga_Actual_Trabajo: {
                        increment: 1
                    }
                }
            });
        });

    };

    createManual = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const body = request.body;

            const asignar = await this.prisma.$transaction(async (prisma) => {
                //1. Crear la asignacion de forma Manual 
                const manual = await this.prisma.asignacion.create({
                    data: {
                        metodo: "Manual",
                        ticketId: body.ticketId,
                        observaciones: body.observaciones,
                        usuarioId: body.usuarioId,
                    }
                });

                //2. Actualizar el estado del ticket a asignado
                const ticketUpdate = await prisma.ticket.update({
                    where: { id: body.ticketHId },
                    data: { estadoId: 2 }
                });

                //3. Crear el nuevo estado del historial
                await prisma.ticketHistorial.create({
                    data: {
                        ticketId: body.idTicket,
                        estado_AnteriorId: 2,
                    },
                });

            });

        } catch (error) {
            console.error("Error al asignar de forma manual:", error);
            next(error);
        }
    }
}