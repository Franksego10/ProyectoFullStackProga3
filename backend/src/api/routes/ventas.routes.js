/*
==========================
    RUTAS DE VENTAS
==========================
*/
import { Router } from "express";
import { crearVenta } from "../controllers/venta.controllers.js";
import { __dirname, join } from "../utils/index.js";

const router = Router();

router.post("/", crearVenta)

export default router;