import { Router } from 'express'
import { categoriaController } from '../controllers/categoriaController'
export class CategoriaRoutes {
    static get routes(): Router {
        const router = Router()
        const controller = new categoriaController()
        //GET localhost:3000/orden/
        router.get('/', controller.get)
        //GET localhost:3000/orden/3
        router.get('/:id',controller.getById)
        router.post("/", controller.create);
        //Actualizar 
        router.put("/:id", controller.update);
        return router
    }
}