// Rutas de vistas
import { Router } from "express";
import { __dirname, join } from "../utils/index.js";
import { indexView, getProductView, createProductView, modifyProductView, deleteProductView} from "../controllers/view.controllers.js";
import { requireLogin } from "../middlewares/middlewares.js";

const router = Router();

router.get("/index", requireLogin, indexView);

router.get("/consultar", requireLogin, getProductView);

router.get("/crear", requireLogin, createProductView);

router.get("/modificar", requireLogin, modifyProductView);

router.get("/eliminar", requireLogin, deleteProductView);

export default router;