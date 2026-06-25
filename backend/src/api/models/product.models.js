/*
============================
    MODELOS DE PRODUCTOS
============================
*/

import connection from "../database/db.js";

////////////////////////////////
// Traemos todos los productos

const selectAllProducts = () => {
    // Ahora sí podés usar await acá adentro perfectamente
    const sql = "SELECT id, nombre, descripcion, categoria, pathImagen, precio, activo, stock FROM productos";
    return connection.query(sql);
}

///////////////////////////////
// Traemos Producto por ID

const selectProductById = (id) => {
    const sql = "SELECT id, nombre, descripcion, categoria, pathImagen, precio, activo, stock FROM productos WHERE productos.id = ?";
    // const id = request.params.id //Obtengo el valor que paso por la URL
    // Ahora el validateId captura el valor del id limpio (el id ahora esta dentro de la request)
    return connection.query(sql, [id]);
}

///////////////////////////////
// Creamos nuevo Producto

const insertNewProduct = (nombre, descripcion, categoria, imagen, precio, stock) => {
    // 2. Insertamos en la base de datos usando placeholders (?) por seguridad
    const sql = "INSERT INTO productos (nombre, descripcion, categoria, pathImagen, precio, stock) VALUES (?, ?, ?, ?, ?, ?)"
    // Devolvemos la respuesta en rows para devolver info util ccomo el id del producto
    return connection.query(sql, [nombre, descripcion, categoria, imagen, precio, stock]);       
    
}

////////////////////////////////
// Modificamos un producto

const updateProduct = (nombre, descripcion, categoria, imagen, precio, stock, active, id) => {
    // 2. Actualizamos en la base de datos usando placeholders (?) por seguridad
    const sql = "UPDATE productos SET nombre = ?, descripcion = ?, categoria = ?, pathImagen = ?, precio = ?, stock = ?, activo = ? WHERE id = ?";
    // Guardamos el resultado de la conexion de la BD
    return connection.query(sql, [nombre, descripcion, categoria, imagen, precio, stock, active, id]);
}

////////////////////////////////
// Eliminamos un Producto

const deleteProduct = (id) => {
    // 2. Mandamos la sentencia sql para eliminar el producto de la base de datos segun el id que se le paso
    const sql = "DELETE FROM productos WHERE id = ?"
    return connection.query(sql, [id]);
}

export default {
    selectAllProducts,
    selectProductById,
    insertNewProduct,
    updateProduct,
    deleteProduct
}