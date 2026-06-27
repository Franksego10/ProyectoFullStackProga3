//===================================
//     RUTAS DE AUTENTIFICACION
//===================================

import { Router } from "express";
import { destroyLogin, loginView, processLoginInfo } from "../controllers/auth.controllers.js";
const router = Router();


// Obtener las vistas del login
router.get("/", loginView);

// Endpoint para recibir la info <form> de login

router.post("/", processLoginInfo);

// Endpoint para cerrar sesion desde el dashboard
router.post("/destroy", destroyLogin);

export default router;
