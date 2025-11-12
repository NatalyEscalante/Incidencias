import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/custom.error";
import { PrismaClient } from "../../generated/prisma";
import { especialidades } from "../../prisma/seeds/especialidades";

export class tecnicoController {
    prisma = new PrismaClient();

    get = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const listado = await this.prisma.usuario.findMany({

                where: {
                    rolId: 3
                },
                orderBy: {
                    nombreCompleto: "asc"
                },
                select: {
                    id: true,
                    nombreCompleto: true,
                    rol: {
                        select: {
                            nombre: true
                        }
                    },
                    estado: {
                        select: {
                            estado: true
                        }
                    },
                    activo: true
                }
            });
            response.json(listado);

        } catch (error) {
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
            let idTecnico = parseInt(request.params.id)
            if (isNaN(idTecnico)) {
                next(AppError.badRequest("El ID no es válido"))
            }
            const objeto = await this.prisma.usuario.findUnique({
                where: { id: idTecnico },
                omit: {
                    password: true,
                    updatedAt: true,
                    createdAt: true
                },
                include: {
                    rol: true,
                    estado: true,
                    especialidades: true,
                }
            })
            if (objeto) {
                response.status(200).json(objeto)
            } else {
                next(AppError.notFound("No existe el Técnico"))
            }
        } catch (error: any) {

            next(error)
        }
    };
    //Crear 
    create = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const body = request.body;

            const newTecnico = await this.prisma.usuario.create({
                data: {
                    correo: body.correo,
                    nombreCompleto: body.nombreCompleto,
                    ultimoLogin: new Date(),
                    rolId: 3,
                    password: "$2b$10$1BaQqXuZYNLDAC42PY5fN.ufSOKjApmjkaZrQUYf7ms71PaS1mASO",
                    carga_Actual_Trabajo: 0,
                    estado_DisponibilidadId: body.estado_DisponibilidadId,
                    especialidades: {
                        connect: body.especialidades,
                    },
                },
            });
            response.status(201).json(newTecnico);
        } catch (error) {
            console.error("Error creando el usuario:", error);
            next(error);
        }
    }

    //Actualizar 
    update = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const body = request.body;
            const idTecnico = parseInt(request.params.id);

            //obtener tecnico anterior
            const tecnicoExistente = await this.prisma.usuario.findUnique({
                where: { id: idTecnico },
                include: {
                    especialidades: {
                        select: {
                            id: true,
                        },
                    },
                },
            });
            if (!tecnicoExistente) {
                response.status(404).json({ message: "El Tecnico no existe" });
                return
            }
            //itera cada especialidad del tecnico en la BD
            const disconnectEspecialidades = tecnicoExistente.especialidades.map(
                (especialidad: { id: number }) => ({ id: especialidad.id })
            );
            //Itera cada especialidad del body 
            const connectEspecialidades = body.especialidades
                ? body.especialidades.map((especialidad: { id: number }) => ({ id: especialidad.id }))
                : [];

            //Actualizar
            const updateTecnico = await this.prisma.usuario.update({
                where: {
                    id: idTecnico,
                },
                data: {
                    correo: body.correo,
                    nombreCompleto: body.nombreCompleto,
                    ultimoLogin: new Date(),
                    rolId: 3,
                    estado_DisponibilidadId: body.estado_DisponibilidadId,
                    especialidades: {
                        disconnect: disconnectEspecialidades,
                        connect: connectEspecialidades,
                    },
                },
            });

            response.json(updateTecnico);
        } catch (error) {
            console.error("Error actualizando técnico:", error);
            next(error);
        }
    };
} 