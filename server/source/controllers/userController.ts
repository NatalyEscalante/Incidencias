import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { PrismaClient, Rol, Usuario } from "../../generated/prisma";
import passport from "passport";
import { generateToken } from "../config/authUtils";
import { AppError } from "../errors/custom.error";
import { rol } from "../../prisma/seeds/rol";

const prisma = new PrismaClient();

export class UserController {
  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { nombreCompleto, correo, password, rolId } = req.body;

      //Validación
      if (!nombreCompleto || !correo || !password || !rolId) {
        next(AppError.badRequest("Todos los campos son requeridos"))
      }

      //verificar si existe usuario 
      const findUser = await prisma.usuario.findUnique({
        where: { correo }
      })

      if (findUser) {
        next(AppError.badRequest("El usuario se encuentra registrado"))
      }

      const salt = await bcrypt.genSalt(10);//el largo de encriptar la contrase..
      const hash = await bcrypt.hash(password, salt);

      const user = await prisma.usuario.create({
        data: {
          nombreCompleto,
          correo,
          password: hash,
          rolId: parseInt(rolId),
          ultimoLogin: new Date(),
          activo: true,
        },
        include: {
          rol: true
        }
      });
      res.status(201).json({
        success: true,
        message: "Usuario creado",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };

  login = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate(
    "local",
    { session: false },
    async (  
      err: Error | null,
      user: Express.User | false | null,
      info: { message?: string }
    ) => {
      if (err) return next(err);
      if (!user) {
        return res
          .status(401)
          .json({ success: false, message: info.message });
      }

      try {
        // Obtén el usuario 
        const getUser = await prisma.usuario.findUnique({
          where: { id: (user as any).id },
          include: { rol: true }
        });

        if (!getUser) {
          return res.status(401).json({ 
            success: false, 
            message: "Usuario no encontrado" 
          });
        }

        const token = generateToken({
          id: getUser.id,
          correo: getUser.correo,
          rol: getUser.rol  
        });
        
        return res.json({
          success: true,
          message: "Inicio de sesión exitoso",
          token,
        });
      } catch (error) {
        next(error);
      }
    }
  )(req, res, next);
};
  
//Get the user that are login
  userAuth = (req: Request, res: Response, next: NextFunction) => {
    try {
      const usuario = req.user as Usuario;
      res.json(usuario);

    } catch (error) {
      next(error);
    }
  };
}
