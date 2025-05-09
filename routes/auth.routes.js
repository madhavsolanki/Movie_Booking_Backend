import express from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/auth.controller.js";
import isAuthenticated from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/logout", isAuthenticated, logoutUser);

export default router;