/////////////////////
// Importaciones
import express from "express";
import environment from "./src/api/config/environment.js"; // importamos los datos de la BD
// import connection from "./src/api/database/db.js"; // importamos pool de conexiones // ya no lo necesitamos porque esta en product.routes.js
import { productRoutes } from "./src/api/routes/index.js";
import cors from "cors"; // da permiso a las solicitudes / peticiones
import { loggerURL } from "./src/api/middlewares/middlewares.js";

const app = express();

//---------------------------------------------------------------------------------------------------------------------

/////////////////////
// Config
const PORT = environment.port; // puerto de la base de datos

//---------------------------------------------------------------------------------------------------------------------

/////////////////////
// Middlewares

// Middleware basico para permitir todas las solicitudes
app.use(cors()); 

// Middleware para parsear JSON del body en las solicitudes POST y PUT a Objeto JS
app.use(express.json());

app.use(loggerURL);

//---------------------------------------------------------------------------------------------------------------------

/////////////////////
// Endpoints

app.get("/", (req, res) => {
    res.send("Libreria Dominico");
});

// RUTAS
app.use("/productos", productRoutes); // product.routes.js es un middleware


app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});