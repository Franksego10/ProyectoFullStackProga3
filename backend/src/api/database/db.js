// Importamos el modulo Mysql2 en modo promesas para poder hacer peticiones asincronas a la BBDD, haremos consultas async await
import mysql2 from "mysql2/promise"

// Importamos la informacion de la conexion a la BBDD
import environment from "../config/environment.js"

// Extraemos solo el objeto DataBase
const {database} = environment

// Creamos la conexion a la BBDD (un pool de conexiones)
const connection = mysql2.createPool({
    host:database.host,
    database:database.name,
    user:database.user,
    password:database.password
})

export default connection;

/* 
    - mysql2 es el modulo que nos provee de metodos para conectarnos a la BBDD

    - createPool() es una funcion que crea un grupo (pool) de conexiones a la BBDD
        - Crea un gestor de conexiones automatico
        - Se conecta a la BBDD usando los parametros (host, user, password, etc)
        - Por defecto abre hasta 10 conexiones simultaneas
        - Ya que importarmos mysql2/promises permite usar await connection.query() para ejecutar SQL
        - Le pasamos la configuracion desde el objeto databse
*/