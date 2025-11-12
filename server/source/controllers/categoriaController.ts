import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/custom.error";
import { PrismaClient } from "../../generated/prisma";

export class categoriaController {
    prisma = new PrismaClient();

    get = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const listado = await this.prisma.categoria.findMany({

                select: {
                    id: true,
                    nombre: true,
                    sla: {
                        select: {
                            tiempoResolucion: true,
                            tiempoRespuesta: true,
                        }
                    },
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
            let idCategoria = parseInt(request.params.id)
            if (isNaN(idCategoria)) {
                next(AppError.badRequest("El ID no es válido"))
            }
            const objeto = await this.prisma.categoria.findUnique({
                where: { id: idCategoria },
                include: {
                    etiquetas: true,
                    especialidades: {
                        select: {
                            id: true,
                            nombre: true,
                            descripcion: true,
                            activo: true,
                        }
                    },
                    sla: true
                }
            })
            if (objeto) {
                response.status(200).json(objeto)
            } else {
                next(AppError.notFound("No existe la categoria"))
            }
        } catch (error: any) {

            next(error)
        }
    };
    //Crear 
    create = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const body = request.body;

            const newCategoria = await this.prisma.categoria.create({
                data: {
                    nombre: body.nombre,
                    slaId: body.slaId,
                    especialidades: {
                        connect: body.especialidades,
                    },
                    etiquetas: {
                        connect: body.etiquetas,
                    }
                },
            });
            response.status(201).json(newCategoria);
        } catch (error) {
            console.error("Error creando la categoria:", error);
            next(error);
        }
    }

    //Actualizar 
    update = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const body = request.body;
            const idCategoria = parseInt(request.params.id);

            //obtener tecnico anterior
            const categoriaExistente = await this.prisma.categoria.findUnique({
                where: { id: idCategoria },
                include: {
                    especialidades: {
                        select: {
                            id: true,
                        },
                    },
                    etiquetas: {
                        select: {
                            id: true,
                        },
                    },
                },
            });
            if (!categoriaExistente) {
                response.status(404).json({ message: "La categoría no existe" });
                return
            }
            //itera cada especialidad de la categoria en la BD
            const disconnectEspecialidades = categoriaExistente.especialidades.map(
                (especialidad: { id: number }) => ({ id: especialidad.id })
            );
            
            //Itera cada especialidad del body 
            const connectEspecialidades = body.especialidades
                ? body.especialidades.map((especialidad: { id: number }) => ({ id: especialidad.id }))
                : [];

              //itera cada etiqueta de la categoria en la BD
            const disconnectEtiqueta = categoriaExistente.etiquetas.map(
                (etiqueta: { id: number }) => ({ id: etiqueta.id })
            );   
            //Itera cada etiqueta del body 
            const connectEtiqueta = body.etiquetas
                ? body.etiquetas.map((etiqueta: { id: number }) => ({ id: etiqueta.id }))
                : [];
    
            //Actualizar
            const updateCategoria = await this.prisma.categoria.update({
                where: {
                    id: idCategoria,
                },
                
                data: {
                    nombre: body.nombre,
                    slaId: body.slaId,
                    especialidades: {
                        disconnect: disconnectEspecialidades,
                        connect: connectEspecialidades,
                    },
                    etiquetas: {
                        disconnect: disconnectEtiqueta,
                        connect: connectEtiqueta,
                    }
                },
            });

            response.json(updateCategoria);
        } catch (error) {
            console.error("Error actualizando la categoría:", error);
            next(error);
        }
    };
} 