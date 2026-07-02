import VentaModels from "../models/venta.models.js";
import { __dirname, join } from "../utils/index.js"


// Controladores de Ventas
export const crearVenta = async (req, res) => {
    try {
        let { fecha, precio_total, nombre, productos } = req.body;

        const nuevaVenta = await VentaModels.insertNewVenta(fecha, precio_total, nombre, productos); //

        res.status(201).json({
            message: "Venta creada con éxito.",
            ventaID: nuevaVenta.insertId 
        });
    }
    catch(error) {
        console.log(error);
        const status = error.message.includes("stock") ? 400 : 500;
        res.status(status).json({
            message: error.message
        });
    }
}