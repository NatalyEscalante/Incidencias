import { Router } from "express";
import { UserController } from "../controllers/userController";
import { authenticateJWT } from "../middleware/authMiddleware";

export class UserRoutes {
  static get routes(): Router {
    const router = Router();
    const controller = new UserController();

    router.post("/login", controller.login);
    router.post("/register", controller.register);
    router.get("/profile", authenticateJWT, controller.userAuth);
    return router;
  }
}
