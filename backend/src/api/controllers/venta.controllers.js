import VentaModels from "../models/venta.models.js";
import { __dirname, join } from "../utils/index.js"


// Controladores de Ventas
export const crearVenta = async (req, res) => {
    try{
        // 1. Capturamos los datos que vienen del formulario (request.body), gracias al middleware app.use(express.json()), que convierte el JSON a Objeto
        // ademas vienen limpios gracias al middleware validate Product
        let {fecha, precio_total, nombre, productos} = req.body; // destructuring

        const [rows] = await VentaModels.insertNewVenta(fecha, precio_total, nombre);

        // 3. Respuesta de exito (201 Created)
        res.status(201).json({
            message: "Producto creado con exito.",
            ventaID: rows.insertId
        });
    }
    catch(error){
        console.log(error);
        // Devolvemos un codigo 500 Internal sv error
        res.status(500).json({
            message: "Error interno del servidor"
        });
    }
}