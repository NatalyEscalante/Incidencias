import { Router } from 'express'
import { ticketController } from '../controllers/ticketController'
export class TicketoRoutes {
    static get routes(): Router {
        const router = Router()
        const controller = new ticketController()
        //GET localhost:3000/orden/
        //router.get('/', controller.get),
        //http://localhost:3000/ticket/search?rol=2
        router.get('/search', controller.get)
        router.get('/', controller.getTicketsPendientes)
        router.get('/:id', controller.getById)
        router.get('/:id/siguiente-estado', controller.getSiguienteEstado);
        //Crear 
        router.post("/", controller.create);

        // Cambiar estado de ticket
        router.put('/:id/estado', controller.cambiarEstado);
        return router
    }
}