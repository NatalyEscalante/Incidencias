import { Router } from 'express';
import { TecnicoRoutes } from './tecnico.routes';
import { CategoriaRoutes } from './categoria.routes';
import { TicketoRoutes } from './ticket.routes';
export class AppRoutes {
    static get routes(): Router {
        const router = Router();

        // ----Agregar las rutas---- 
        router.use('/tecnicos',TecnicoRoutes.routes),
        router.use('/categoria', CategoriaRoutes.routes),
        router.use('/ticket', TicketoRoutes.routes)
        return router;
    }
}