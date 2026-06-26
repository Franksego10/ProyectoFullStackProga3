// Rutas de vistas
import { Router } from "express";
import { __dirname, join } from "../utils/index.js";

const router = Router();

router.get("/", (req, res) => {
    res.send("vistasEJS");
})

export default router;