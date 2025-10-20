import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/custom.error";
import { PrismaClient } from "../../generated/prisma";

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