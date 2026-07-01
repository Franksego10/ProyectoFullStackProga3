/*
==========================
    RUTAS DE USUARIOS
==========================
*/

import { Router } from "express"; // Router nos lo provee express para usarlo como middleware
import { createAdminUser } from "../controllers/user.controllers.js";
const router = Router(); // inicializamos instancia de aplicacion


// endpoint POST (F) Create Product
router.post("/", createAdminUser);


// exportamos las rutas y las centralizamos en el archivo de barril index.js de routes
export default router;
