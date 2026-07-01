import { Sequelize } from "sequelize"

// Importamos la informacion de la conexion a la BBDD
import environment from "../config/environment.js"

const {database} = environment

// Creamos la conexion a la BBDD (un pool de conexiones)
const sequelize = new Sequelize(database.name, database.user, database.password, {
    host:database.host,
    dialect: "mysql",
    define: {
        timestamps: false,
        underscored: false
    }
});

export const connectDatabase = async () => {
    try {
        await sequelize.authenticate //Devuelve una promesa
        console.log("Nos conectamos a la BD: " + database.name)

        sequelize.sync({alter:false})
    } catch (error) {
        console.log(error)
        throw error
    }
}

export default sequelize;