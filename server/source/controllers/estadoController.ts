import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/custom.error";
import { PrismaClient } from "../../generated/prisma";

export class estadoController {
    prisma = new PrismaClient();


    get = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const listado = await this.prisma.estadoDisponibilidad.findMany({

            });
            response.json(listado);
        } catch (error) {
            next(error);
        }
    };
};

