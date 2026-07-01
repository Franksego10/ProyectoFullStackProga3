/*
============================
    MODELOS DE PRODUCTOS
============================
*/

//import connection from "../database/db.js";
import sequelize from "../database/sequelize.js";
import { DataTypes } from "sequelize";

const Producto = sequelize.define("Productos", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
        // validate:{
        //     isAlphanumeric:false
        // }
    },
    descripcion: {
        type: DataTypes.STRING,
        allowNull: true
    },
    pathImagen: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    categoria: {
        type: DataTypes.ENUM(["comic", "libro"])
    },
    precio: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    activo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
});


////////////////////////////////
// Traemos todos los productos

const selectAllProducts = async () => {
    const rows = await Producto.findAll()
    return [rows,null]
}
// Traemos todos los productos que tengan ACTIVO = 1

const selectAllActiveProducts = async () => {
    const rows = await Producto.findAll({ where: { activo: 1 } });
    return [rows, null];
}

///////////////////////////////
// Traemos Producto por ID

const selectProductById = async (id) => {
    const producto = await Producto.findByPk(id)
    return [producto ? [producto] : []]
}

///////////////////////////////
// Creamos nuevo Producto

const insertNewProduct = async (nombre, descripcion, categoria, imagen, precio, stock, active) => {
    const productoCreado = await Producto.create({
        nombre,
        descripcion,
        categoria,
        pathImagen: imagen,
        precio,
        stock,
        activo: active
    });
    return [{insertId : productoCreado.id}];
    
}

////////////////////////////////
// Modificamos un producto

const updateProduct = async (nombre, descripcion, categoria, imagen, precio, stock, active, id) => {
    const [affectedRows] = await Producto.update({
        nombre,
        descripcion,
        categoria,
        pathImagen: imagen,
        precio,
        stock,
        activo: active},
    {
        where:{id}
    })

    return [{affectedRows}]
}

////////////////////////////////
// Eliminamos un Producto

const deleteProduct = async (id) => {
    // // 2. Mandamos la sentencia sql para eliminar el producto de la base de datos segun el id que se le paso
    // const sql = "DELETE FROM productos WHERE id = ?"
    // return connection.query(sql, [id]);
    const deleteProduct = await Producto.destroy({
        where:{id}
    })
    console.log(deleteProduct)
}

export default {
    selectAllProducts,
    selectAllActiveProducts,
    selectProductById,
    insertNewProduct,
    updateProduct,
    deleteProduct
}