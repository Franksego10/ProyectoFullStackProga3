/*
============================
    MODELOS DE PRODUCTOS
============================
*/

//import connection from "../database/db.js";
import sequelize from "../database/sequelize.js";
import { DataTypes } from "sequelize";
import { Producto } from "./product.models.js";

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
    const t = await sequelize.transaction();

    try {
        // Validacion de stock (segunda linea de defensa)
        for (const producto of productos) {
            const productoDB = await Producto.findByPk(producto.idProducto, { transaction: t });
            if (productoDB.stock < producto.cantidadProducto) {
                throw new Error(`Stock insuficiente de "${productoDB.nombre}". Disponible: ${productoDB.stock}`);
            }
        }

        const ventaCreada = await Ventas.create({
            fecha, precio_total, nombre_usuario: nombre
        }, { transaction: t });

        const detalles = productos.map(p => ({
            venta_id: ventaCreada.id,
            producto_id: p.idProducto,
            cantidad: p.cantidadProducto
        }));

        await VentasProductos.bulkCreate(detalles, { transaction: t });

        // Descontar stock en un solo loop
        for (const producto of productos) {
            const productoDB = await Producto.findByPk(producto.idProducto, { transaction: t });
            const nuevoStock = productoDB.stock - producto.cantidadProducto;

            await productoDB.update({
                stock: nuevoStock,
                activo: nuevoStock <= 0 ? 0 : productoDB.activo
            }, { transaction: t });
        }

        await t.commit();
        return { insertId: ventaCreada.id };

    } catch (error) {
        await t.rollback();
        throw error;
    }
}

export default {
    insertNewVenta
}