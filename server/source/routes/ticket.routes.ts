import { Router } from 'express'
import { ticketController } from '../controllers/ticketController'
export class TicketoRoutes {
    static get routes(): Router {
        const router = Router()
        const controller = new ticketController()
        //GET localhost:3000/orden/
        //router.get('/', controller.get),
        router.get('/search',controller.get)
        router.get('/:id',controller.getById)

        return router
    }
}