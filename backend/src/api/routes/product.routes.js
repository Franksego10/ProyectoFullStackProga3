/*
==========================
    RUTAS DE PRODUCTOS
==========================
*/

import { Router } from "express"; // Router nos lo provee express para usarlo como middleware
const router = Router(); // inicializamos instancia de aplicacion

import { validateId, validateProduct } from "../middlewares/middlewares.js";
import { createProduct, removeProduct, getAllProducts, getProductById, modifyProduct } from "../controllers/product.controllers.js";

// endpoint GET (L) Get All Products
router.get("/", getAllProducts);

// endpoint GET BY ID (L) Get Product By ID
router.get("/:id", validateId, getProductById);

// endpoint POST (F) Create Product
router.post("/", validateProduct, createProduct);

// endpoint PUT (F) (Update/modify product)
router.put("/", modifyProduct);

// endpoint DELETE (F) 
router.delete("/:id", validateId, removeProduct);

// exportamos las rutas y las centralizamos en el archivo de barril index.js de routes
export default router;
