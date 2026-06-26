//===================================
//     RUTAS DE AUTENTIFICACION
//===================================

import { Router } from "express";
import { loginView } from "../controllers/auth.controllers.js";
const router = Router();

router.get("/", loginView);

export default router;
