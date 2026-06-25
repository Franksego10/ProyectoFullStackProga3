/*
===================================
    Controladores de Productos
===================================
*/

import connection from "../database/db.js";
import ProductModels from "../models/product.models.js";

///////////////////////
// GET ALL PRODUCTS
export const getAllProducts = async (req, res) => {
    try {
        // traemos lo que devuelve la connection
        const [rows, fields] = await ProductModels.selectAllProducts();

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
}

///////////////////////////
// GET PRODUCT BY ID 

export const getProductById = async(req, res) => {
    try{

        const [rows] = await ProductModels.selectProductById(req.id);
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
}

//////////////////////////////////////
// POST PRODUCT / CREATE NEW PRODUCT 

export const createProduct = async (req, res) => {
    try{
        // 1. Capturamos los datos que vienen del formulario (request.body), gracias al middleware app.use(express.json()), que convierte el JSON a Objeto
        // ademas vienen limpios gracias al middleware validate Product
        const { nombre, descripcion, categoria, imagen, precio, stock} = req.body; // destructuring

        const [rows] = await ProductModels.insertNewProduct(nombre, descripcion, categoria, imagen, precio, stock);
        // 3. Respuesta de exito (201 Created)
        res.status(201).json({
            message: "Producto creado con exito.",
            productId: rows.insertId
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

////////////////////////////
// PUT / MODIFY PRODUCT (UPDATE)
export const modifyProduct = async (req, res) => {
    try{
        // 1. Capturamos los datos que vienen del formulario (request.body) destructurandolos
        const {id, nombre, descripcion, categoria, imagen, precio, stock, active} = req.body;

        // Validamos que vengan los campos requeridos antes de tocar la BBDD
        if(!nombre || !descripcion || !categoria || !imagen || !precio || !stock || active === undefined){
            return res.status(400).json({
                message: "Se requiere que todos los campos esten llenos"
            })
        }
        
        const [result] = await ProductModels.updateProduct(nombre, descripcion, categoria, imagen, precio, stock, active, id);
        //Verificamos si se actualizo guardando la respuesta de la base de datos
        // si hubo filas afectadas
        if (result.affectedRows === 0){
            return res.status(404).json({
                message: "No se actualizo ningun campo"
            });
        }

        // 3. Respuesta de exito
        return res.status(200).json({
            message: "Producto actualizado correctamente."
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

//////////////////////////////
// Delete Product

export const removeProduct = async (req, res) => {
    try{
        // 1. Guardamos el id del producto pasado por la url
        //const id = req.params.id;
        // validateId captura el id en la request
    
        await ProductModels.deleteProduct(req.id);
    
        // 3. Respuesta de exito
        res.status(200).json({
            message: `Producto con id ${req.id} eliminado exitosamente.`
        })
    }
    catch(error){
        console.error("Error en la peticion DELETE ", error);
        res.status(500).json({
            message: "Error interno del servidor"
        });
    }
}
