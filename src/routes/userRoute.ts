import { Router } from "express";
import { UserController } from "../controllers/UserController";

const userController = new UserController();

const userRoute = Router();
userRoute.route("/user").post((req, res) => userController.create(req, res));
userRoute.route("/login").post((req, res) => userController.auth(req, res));

export { userRoute };
