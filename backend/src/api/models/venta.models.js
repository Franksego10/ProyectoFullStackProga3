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

const insertNewVenta = async (fecha, precio_total, nombre) => {
    const ventaCreada = await Ventas.create({
    fecha,
    precio_total,
    nombre_usuario:nombre
    });
    return [{insertId : ventaCreada.id}];
}

export default {
    insertNewVenta
}