/*
===================================
    MODELOS DE AUTENTIFICACION
===================================
*/

import connection from "../database/db.js";

const selectUser = (email, password) => {
    const sql = "SELECT * FROM USUARIOS WHERE correo = ? and contrasena = ?";
    return connection.query(sql, [email, password]);
}

export default {
    selectUser
}