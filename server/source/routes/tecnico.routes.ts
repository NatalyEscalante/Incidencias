import { Router } from 'express'
import { tecnicoController } from '../controllers/tecnicoController'
export class TecnicoRoutes {
    static get routes(): Router {
        const router = Router()
        const controller = new tecnicoController()
        //GET localhost:3000/orden/
        router.get('/', controller.get)
        //GET localhost:3000/orden/3
        router.get('/:id',controller.getById)

        return router
    }
}