// Rutas de vistas
import { Router } from "express";
import { __dirname, join } from "../utils/index.js";
import { indexView } from "../controllers/view.controllers.js";

const router = Router();

router.get("/", indexView)

export default router;