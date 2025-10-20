import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/custom.error";
import { PrismaClient } from "../../generated/prisma";

export class ticketController {
    prisma = new PrismaClient();

    get = async (request: Request, response: Response, next: NextFunction) => {
        try {
            // Obtener el usuarioId desde query parameters
            const { rol } = request.query
            const usuarioId = parseInt(rol as string)

            if (!usuarioId || isNaN(usuarioId)) {
                next(AppError.badRequest("El criterios de búsqueda es requerido"))
            }

            // Obtener el usuario con su rol
            const usuario = await this.prisma.usuario.findUnique({
                where: { id: usuarioId },
                include: { rol: true }
            });

            if (!usuario) {
                return response.status(404).json({ error: "Usuario no encontrado" });
            }

            let listaTickets = {};

            // Filtrar según el rol del usuario
            if (usuario.rol.nombre === "Administrador") {
                listaTickets = {};
            } else if (usuario.rol.nombre === "Cliente") {
                listaTickets = { usuarioId: usuarioId };
            } else if (usuario.rol.nombre === "Técnico") {
                listaTickets = {
                    asignaciones: {
                        some: {
                            usuarioId: usuarioId
                        }
                    }
                };
            }

            const listado = await this.prisma.ticket.findMany({
                where: listaTickets,
                orderBy: {
                    createdAt: "desc"
                },
                select: {
                    id: true,
                    titulo: true,
                    createdAt: true,
                    usuario: {
                        select: {
                            id: true,
                            nombreCompleto: true
                        }
                    },
                    categoria: {
                        select: {
                            nombre: true
                        }
                    },
                    estadoTicket: {
                        select: {
                            estado: true
                        }
                    },
                }
            });

            const ticketsConEnlace = listado.map(ticket => ({
                id: ticket.id,
                titulo: ticket.titulo,
                fechaCreacion: ticket.createdAt,
                usuarioCreador: ticket.usuario.nombreCompleto,
                categoria: ticket.categoria.nombre,
                estado: ticket.estadoTicket.estado,
            }));

            response.json({
                usuario: {
                    id: usuario.id,
                    nombre: usuario.nombreCompleto,
                    rol: usuario.rol.nombre
                },
                totalTickets: listado.length,
                tickets: ticketsConEnlace
            });
        } catch (error) {
            console.error('Error en ticketController:', error);
            next(error);
        }
    };
    //Obtener por Id 
    getById = async (
        request: Request,
        response: Response,
        next: NextFunction
    ) => {
        try {
            let idTicket = parseInt(request.params.id)
            if (isNaN(idTicket)) {
                next(AppError.badRequest("El ID no es válido"))
                return
            }

            const ticket = await this.prisma.ticket.findUnique({
                where: { id: idTicket },
                include: {
                    usuario: {
                        select: {
                            id: true,
                            nombreCompleto: true,
                            correo: true
                        }
                    },
                    categoria: {
                        include: {
                            sla: true
                        }
                    },
                    prioridad: true,
                    estadoTicket: true,
                    historias: {
                        include: {
                            estadoA: true,
                            imagenes: true
                        },
                        orderBy: {
                            updatedAt: 'asc'
                        }
                    },
                    valoraciones: {
                        select: {
                            comentario: true,
                            valoracion: true,
                            fecha: true,
                        }
                    },
                    asignaciones: {
                        include: {
                            usuario: {
                                select: {
                                    id: true,
                                    nombreCompleto: true
                                }
                            }
                        }
                    }
                }
            })

            if (!ticket) {
                next(AppError.notFound("Ticket no encontrado"))
                return
            }

            // FUNCIONES PARA CALCULAR EL SLA
            const convertirTiempoSLA = (tiempoString: string): number => {
                // Convierte "HH:MM:SS" a horas decimales
                const [horas, minutos, segundos] = tiempoString.split(':').map(Number);
                return horas + (minutos / 60) + (segundos / 3600);
            };

            const calcularFechaLimite = (fechaInicio: Date, tiempoSLA: string): Date => {
                const horasSLA = convertirTiempoSLA(tiempoSLA);
                const fechaLimite = new Date(fechaInicio);

                // Sumar las horas completas y los minutos
                const horas = Math.floor(horasSLA);
                const minutos = Math.round((horasSLA - horas) * 60);

                fechaLimite.setHours(fechaLimite.getHours() + horas);
                fechaLimite.setMinutes(fechaLimite.getMinutes() + minutos);

                return fechaLimite;
            };

            const calcularDiasResolucion = (fechaInicio: Date, fechaFin: Date | null): number | null => {
                if (!fechaFin) return null;

                const inicio = new Date(fechaInicio);
                const fin = new Date(fechaFin);

                // Establecer ambas fechas a medianoche para comparar solo días
                inicio.setHours(0, 0, 0, 0);
                fin.setHours(0, 0, 0, 0);

                const diffMs = fin.getTime() - inicio.getTime();
                const diffDias = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

                return Math.max(1, diffDias);
            };

            const verificarCumplimiento = (fechaLimite: Date, fechaReal: Date | null): boolean | null => {
                if (!fechaReal) return null;
                return fechaReal <= fechaLimite;
            };

            // Obtener la fecha de asignación 
            const fechaAsignacion = ticket.historias.find(h =>
                h.estadoA.estado === "Asignado"
            )?.updatedAt || null;

            // CÁLCULOS DEL SLA
            const slaRespuestaFechaLimite = calcularFechaLimite(ticket.createdAt, ticket.categoria.sla.tiempoRespuesta);
            const slaResolucionFechaLimite = calcularFechaLimite(ticket.createdAt, ticket.categoria.sla.tiempoResolucion);

            const diasResolucion = calcularDiasResolucion(ticket.createdAt, ticket.fechaCierre);

            const cumplimientoRespuesta = verificarCumplimiento(slaRespuestaFechaLimite, fechaAsignacion);
            const cumplimientoResolucion = verificarCumplimiento(slaResolucionFechaLimite, ticket.fechaCierre);

            // Formatear la respuesta
            const ticketConSLA = {
                //ticket
                id: ticket.id,
                titulo: ticket.titulo,
                descripcion: ticket.descripcion,
                fechaCreacion: ticket.createdAt,
                fechaCierre: ticket.fechaCierre,
                estado: ticket.estadoTicket.estado,
                prioridad: ticket.prioridad.prioridad,

                //Usuario
                usuarioSolicitante: {
                    id: ticket.usuario.id,
                    nombreCompleto: ticket.usuario.nombreCompleto,
                    correo: ticket.usuario.correo
                },

                // Categoría y SLA
                categoria: ticket.categoria.nombre,
                sla: {
                    tiempoRespuesta: ticket.categoria.sla.tiempoRespuesta,
                    tiempoResolucion: ticket.categoria.sla.tiempoResolucion,
                },

                //Sla 
                diasResolucion: diasResolucion,
                slaRespuesta: {
                    fechaLimite: slaRespuestaFechaLimite,
                    fechaReal: fechaAsignacion,
                    cumplio: cumplimientoRespuesta,
                    estado: cumplimientoRespuesta === null ? 'Pendiente' :
                        cumplimientoRespuesta ? 'Cumplido' : 'Incumplido'
                },
                slaResolucion: {
                    fechaLimite: slaResolucionFechaLimite,
                    fechaReal: ticket.fechaCierre,
                    cumplio: cumplimientoResolucion,
                    estado: cumplimientoResolucion === null ? 'Pendiente' :
                        cumplimientoResolucion ? 'Cumplido' : 'Incumplido'
                },

                // Historias
                historial: ticket.historias.map(historia => ({
                    id: historia.id,
                    estado: historia.estadoA.estado,
                    fechaCambio: historia.updatedAt,
                    imagenes: historia.imagenes.map(img => ({
                        id: img.id,
                        ruta: img.ruta
                    }))
                })),

                // Asignaciones
                asignaciones: ticket.asignaciones.map(asignacion => ({
                    id: asignacion.id,
                    tecnico: asignacion.usuario.nombreCompleto,
                    metodo: asignacion.metodo,
                    fechaAsignacion: asignacion.fechaAsignacion,
                    observaciones: asignacion.observaciones
                })),

                // Valoraciones
                valoraciones: ticket.valoraciones.map(valoracion => ({
                    comentario: valoracion.comentario,
                    valoracion: valoracion.valoracion,
                    fecha: valoracion.fecha
                }))
            }

            response.json(ticketConSLA)

        } catch (error) {
            next(error)
        }
    }
    //Crear 
    create = async (request: Request, response: Response, next: NextFunction) => {
        try {

        } catch (error) {
            next(error);
        }
    };
    //Actualizar 
    update = async (request: Request, response: Response, next: NextFunction) => {
        try {

        } catch (error) {
            next(error);
        }
    };
} 