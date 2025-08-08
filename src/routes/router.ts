import { Router } from "express";
import { userRoute } from "./userRoute";

const routes = Router();
routes.use("/", userRoute);

export { routes };
