import { Router } from "express";
import { login, signup } from "../controllers/auth";

export const authRoutes:Router = Router();

authRoutes.post("/signup",signup)
authRoutes.post("/login",login)