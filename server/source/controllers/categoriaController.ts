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
                    especialidades:{
                        select:{
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