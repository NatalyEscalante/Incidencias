import { Router } from 'express';
import { TecnicoRoutes } from './tecnico.routes';
import { CategoriaRoutes } from './categoria.routes';
import { TicketoRoutes } from './ticket.routes';
import { ImageRoutes } from './image.routes';
import { EspecialidadRoutes } from './especialidad.routes';
import { EtiquetaRoutes } from './etiqueta.routes';
import { SlaRoutes } from './sla.routes';
import { EstadoRoutes } from './estado.routes';
import { PrioridadRoutes } from './prioridad.routes';
import { UserRoutes } from './user.routes';
import { AsignacionRoutes } from './asignacion.routes';
export class AppRoutes {
    static get routes(): Router {
        const router = Router();

        // ----Agregar las rutas---- 
        router.use('/tecnicos',TecnicoRoutes.routes),
        router.use('/categoria', CategoriaRoutes.routes),
        router.use('/ticket', TicketoRoutes.routes),
        router.use('/especialidad', EspecialidadRoutes.routes),
        router.use('/etiqueta', EtiquetaRoutes.routes),
        router.use('/sla', SlaRoutes.routes),
        router.use('/disponibilidad', EstadoRoutes.routes),
        router.use('/prioridad', PrioridadRoutes.routes),
        router.use("/file/", ImageRoutes.routes);
        router.use("/usuario", UserRoutes.routes);
        router.use("/asignacion", AsignacionRoutes.routes);
        return router;
    }
}