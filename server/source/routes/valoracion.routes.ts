import { Router } from 'express'
import { valoracionController } from '../controllers/valoracionController'
export class ValoracionRoutes {
    static get routes(): Router {
        const router = Router()
        const controller = new valoracionController()
        router.post("/", controller.create);
        return router
    }
}