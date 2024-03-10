import { Router } from "express";
import { login, me, signup } from "../controllers/auth";
import { errorHandler } from "../error-handler";
import authMiddleware from "../middlewares/auth";

export const authRoutes:Router = Router();

// @ts-ignore
authRoutes.post("/signup",errorHandler(signup))
// @ts-ignore
authRoutes.post("/login",errorHandler(login))
// @ts-ignore
authRoutes.get("/me",[authMiddleware],errorHandler(me))