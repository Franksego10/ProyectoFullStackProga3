import ProductModels from "../models/product.models.js"
import { __dirname, join } from "../utils/index.js"

// Controladores de vistas
export const indexView = async (req, res) => {
    try
    {
        const [rows] = await ProductModels.selectAllProducts();

        res.render("index", {
            title:"dashboard",
            about:"nuestros-productos",
            productsArray:rows,
            tituloAccion:"Librería Dominico",
            descripcion:"📚 Libros y Cómics para todos 💥"
        })
    }catch (error){
        console.error("Error obteniendo informacion: " + error.message);
        res.status(500).json({message:"Error interno de servidor"});
    }
}

// Vista principal 
export const getProductView = (req, res) => {
    res.render("get", {
        title:"Consultar",
        about:"Buscar producto por ID",
        //productsArray:"",
        tituloAccion:"Consultar producto",
        descripcion:"🔍 Buscá por ID"
    })
}