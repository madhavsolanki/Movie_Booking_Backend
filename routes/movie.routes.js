import express from "express";
import isAuthenticated from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/authorize.middleware.js";
import upload from "../middlewares/multer.js";
import { createMovie, deleteMovie, getAllMovies, getMovieById, updateMovie } from "../controllers/movie.controller.js";

const router = express.Router();

router.post("/create", isAuthenticated, authorizeRoles("ADMIN"), upload.single("poster"), createMovie);

router.get("/:id", isAuthenticated, getMovieById);

router.get("/", isAuthenticated, getAllMovies);

router.put("/update/:id", isAuthenticated, authorizeRoles("ADMIN"), upload.single("poster"),  updateMovie);

router.delete("/delete/:id", isAuthenticated, authorizeRoles("ADMIN"),  deleteMovie);

export default router;