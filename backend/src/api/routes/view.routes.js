// Rutas de vistas
import { Router } from "express";
import { __dirname, join } from "../utils/index.js";
import { indexView, getProductView, createProductView, modifyProductView, deleteProductView} from "../controllers/view.controllers.js";

const router = Router();

router.get("/index", indexView)

router.get("/consultar", getProductView)

router.get("/crear", createProductView)

router.get("/modificar", modifyProductView)

router.get("/eliminar", deleteProductView)

export default router;