import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/custom.error";
import { PrismaClient } from "../../generated/prisma";

export class valoracionController {
    prisma = new PrismaClient();

    //Crear 
    create = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const body = request.body;

            const newValoracion = await this.prisma.valoracion.create({
                data: {
                    ticketId: body.ticketId,
                    comentario: body.comentario,
                    valoracion: body.valoracion
                },
            });
            response.status(201).json(newValoracion);
        } catch (error) {
            console.error("Error creando la valoracion:", error);
            next(error);
        }
    }

} 