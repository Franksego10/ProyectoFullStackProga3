/*
============================
    MODELOS DE PRODUCTOS
============================
*/

//import connection from "../database/db.js";
import sequelize from "../database/sequelize.js";
import { DataTypes } from "sequelize";

const Ventas = sequelize.define("Ventas", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre_usuario: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    fecha: {
        type: DataTypes.DATE,
        allowNull: false
    },
    precio_total: {
        type: DataTypes.FLOAT(),
        allowNull: false
    }
});

const VentasProductos = sequelize.define("Ventas_productos", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    venta_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    producto_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
})

const insertNewVenta = async (fecha, precio_total, nombre, productos) => {
    
    // insertamos datos a la tabla ventas
    const ventaCreada = await Ventas.create({
    fecha,
    precio_total,
    nombre_usuario:nombre
    });

    // insertamos datos a la tabla venta_producto
    for (const producto of productos){
        await VentasProductos.create({
            venta_id: ventaCreada.id,
            producto_id: producto.idProducto,
            cantidad: producto.cantidadProducto
        })
    }

    return [{insertId : ventaCreada.id}];
}

export default {
    insertNewVenta
}