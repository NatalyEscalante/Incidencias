import { Router } from 'express'
import { ticketController } from '../controllers/ticketController'
export class TicketoRoutes {
    static get routes(): Router {
        const router = Router()
        const controller = new ticketController()
        //GET localhost:3000/orden/
        //router.get('/', controller.get),
        //http://localhost:3000/ticket/search?rol=2
        router.get('/search',controller.get)
        router.get('/:id',controller.getById)
         //Crear 
        router.post("/", controller.create);
        //Actualizar 
        router.put("/:id", controller.update);
        return router
    }
}