import { Router } from 'express'
import { especialidadController } from '../controllers/especialidadController'
import { estadoController } from '../controllers/estadoController'
export class EstadoRoutes {
    static get routes(): Router {
        const router = Router()
        const controller = new estadoController()
        router.get('/', controller.get)
        return router
    }
}