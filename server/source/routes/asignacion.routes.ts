import { Router } from 'express'
import { categoriaController } from '../controllers/categoriaController'
import { asignacionController } from '../controllers/asignacionController'
export class AsignacionRoutes {
    static get routes(): Router {
        const router = Router()
        const controller = new asignacionController()
        //GET localhost:3000/orden/
        router.get('/', controller.getPropuestas)
        router.post('/', controller.ejecutarAsignacionAutomatica); 
        router.post('/manual', controller.createManual);
        return router
    }
}