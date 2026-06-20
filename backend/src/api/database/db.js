// Importamos el modulo Mysql2 en modo promesas para poder hacer peticiones asincronas a la BBDD, haremos consultas async await
import mysql2 from "mysql2/promise"

// Importamos la informacion de la conexion a la BBDD
import environments from "../environments.js"

// Extraemos solo el objeto DataBase
const {database} = environments

// Creamos la conexion a la BBDD (un pool de conexiones)
const connection = mysql2.createPool({
    host:database.host,
    database:database.name,
    user:database.user,
    password:database.password
})

export default connection;
// sql 2 es e modulo que nos prodvee metodos para conectarnos a la BBDD 
// createPool( es una funcion que crea un grupo (pool) de conexiones a la BBDD)
