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

// Middleware para parsear JSON del body en las solicitudes POST y PUT a Objeto JS
app.use(express.json());

// Middleware de ruta (se aplica en algunos endopoints)

const validateId = (req, res, next) => {
    const id = Number(req.params.id); // transformo el id pasado por la url a numero

    // si no es entero o es un numero negativo, devuelvo una respuesta 400 (Bad Request)
    if (!Number.isInteger(id) || id <= 0){
        return res.status(400).json({
            message: "Ingrese un id valid (numero entero y positivo)"
        });
    }

    // si no entro al error se sigue ejecutando el codigo
    // incorporamos el id a la request
    req.id = id;
    next(); // Seguimos con el siguiente middleware si existe o vamos a procesar la response
}
//---------------------------------------------------------------------------------------------------------------------

/////////////////////
// Endpoints

app.get("/", (req, res) => {
    res.send("Libreria Dominico");
});

// endpoint GET (L)
app.get("/productos", async (req, res) => {
    try {
        // Ahora sí podés usar await acá adentro perfectamente
        const sql = "SELECT id, nombre, descripcion, categoria, pathImagen, precio, activo, stock FROM productos";
        const [rows, fields] = await connection.query(sql);

        // En caso de no haber productos, error 404
        if (rows.length === 0){
            return res.status(404).json({
                message: "No se encontraron productos."
            });
        }
        
        // Respuesta de exito
        res.status(200).json({
            payload: rows, // payload son los datos
            total: rows.length // enviamos el total de productos
        });
    } catch (error) {
        console.error("Error al consultar la base de datos:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
});

// endpoint GET BY ID (L)
app.get("/productos/:id", validateId, async(req, res) => {
    try{

       // const id = request.params.id //Obtengo el valor que paso por la URL
       // Ahora el validateId captura el valor del id limpio (el id ahora esta dentro de la request)
        const [rows] = await connection.query("SELECT id, nombre, descripcion, categoria, pathImagen, precio, activo, stock FROM productos WHERE productos.id = ?", [req.id])
        console.log(rows)

        // En caso de no haber productos, error 404
        if (rows.length === 0){
            return res.status(404).json({
                message: `No se encotro producto con id ${req.id}`
            });
        }

        res.status(200).json({
            payload: rows
        })
    }catch(error){
        console.error("Error al consultar la base de datos:", error.message);
        res.status(500).json({
            message: `Error interno al obtener un producto con id ${req.id}`
        })
    }
})

// endpoint POST (F)
app.post("/productos", async (req, res) => {
    // 1. Capturamos los datos que vienen del formulario (request.body), gracias al middleware app.use(express.json()), que convierte el JSON a Objeto
    const { nombre, descripcion, categoria, imagen, precio, stock} = req.body; // destructuring

    // 2. Insertamos en la base de datos usando placeholders (?) por seguridad
    const sql = "INSERT INTO productos (nombre, descripcion, categoria, pathImagen, precio, stock) VALUES (?, ?, ?, ?, ?, ?)"
    await connection.query(sql, [nombre, descripcion, categoria, imagen, precio, stock]);

    // 3. Respuesta de exito (201 Created)
    req.status(201).json({
        message: "Producto creado con exito."
    });
})

// endpoint PUT (F) (Update/modify product)

app.put("/productos", async (req, res) => {
    // 1. Capturamos los datos que vienen del formulario (request.body) destructurandolos
    const {id, nombre, descripcion, categoria, imagen, precio, stock} = req.body;
    
    // 2. Actualizamos en la base de datos usando placeholders (?) por seguridad
    const sql = "UPDATE productos SET nombre = ?, descripcion = ?, categoria = ?, imagen = ?, precio = ?, stock = ?, WHERE id = ?";
    await connection.query(sql, [nombre, descripcion, categoria, imagen, precio, stock, id]);

    // 3. Respuesta de exito
    return res.status(200).json({
        message: "Producto actualizado correctamente."
    })
})

// endpoint DELETE (F) 

app.delete("/productos/:id", validateId, async (req, res) => {
    try{
        // 1. Guardamos el id del producto pasado por la url
        //const id = req.params.id;
        // validateId captura el id en la request
    
        // 2. Mandamos la sentencia sql para eliminar el producto de la base de datos segun el id que se le paso
        const sql = "DELETE FROM productos WHERE id = ?"
        await connection.query(sql, [req.id])
    
        // 3. Respuesta de exito
        res.status(200).json({
            message: `Producto con id ${id} eliminado exitosamente.`
        })
    }
    catch(error){
        console.error("Error en la peticion DELETE ", error);
        res.status(500).json({
            message: "Error interno del servidor"
        });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});