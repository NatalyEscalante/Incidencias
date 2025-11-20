import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/custom.error";
import { PrismaClient } from "../../generated/prisma";

export class etiquetaController {
    prisma = new PrismaClient();

    get = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const listado = await this.prisma.etiqueta.findMany({
                select: {
                    id: true,
                    nombre: true,
                    categorias: {  // ← INCLUIR las categorías en el select
                        select: {
                            id: true,
                            nombre: true
                        }
                    }
                }
            });
            response.json(listado);

        } catch (error) {
            next(error);
        }
    };

} 