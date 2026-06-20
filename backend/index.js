/////////////////////
// Importaciones
import express from "express";
import environment from "./src/api/config/environment.js"; // importamos los datos de la BD
import connection from "./src/api/database/db.js"; // importamos pool de conexiones
import cors from "cors"; // da permiso a las solicitudes / peticiones

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

// Middleware logger para analizar todas las solicitudes por consola (tener el historial del consumo de nuestra Api REST en la consola)
app.use((req, res, next) => {
    let fecha = new Date();
    console.log(`[${fecha.toLocaleDateString()} ${fecha.toLocaleTimeString()}] ${req.method} ${req.url}`);
    
    next(); // next() da paso a que continue la respuesta o el siguiente middleware (en caso de haberlo)
});

//---------------------------------------------------------------------------------------------------------------------

/////////////////////
// Endpoints

app.get("/", (req, res) => {
    res.send("Libreria Dominico");
});

// endpoint GET (L)
app.get("/productos", async (request, response) => {
    try {
        // Ahora sí podés usar await acá adentro perfectamente
        const [rows, fields] = await connection.query("SELECT * FROM productos");
        
        response.status(200).json({
            payload: rows // payload son los datos
        });
    } catch (error) {
        console.error("Error al consultar la base de datos:", error);
        response.status(500).json({ error: "Error interno del servidor" });
    }
});

// endpoint GET BY ID (L)
app.get("/productos/:id", async(request, response) => {
    try{
        const id = request.params.id //Obtengo el valor que paso por la URL
        const [rows] = await connection.query("SELECT * FROM productos WHERE productos.id = ?", [id])
        console.log(rows)

        response.status(200).json({
            payload: rows
        })
    }catch(error){
        console.error("Error al consultar la base de datos:", error);
    }
})

// endpoint POST (F)

// endpoint PUT (F)

// endpoint DELETE (F)


app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});