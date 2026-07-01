/*
===================================
    Controladores de Usuarios
===================================
*/

import AuthModels from "../models/auth.models.js";
import bcrypt from "bcrypt"

//////////////////////////////////////
// POST USER / CREATE NEW USER

export const createAdminUser = async (req, res) => {
    try{
        // 1. Capturamos los datos que vienen del formulario (request.body), gracias al middleware app.use(express.json()), que convierte el JSON a Objeto
        // ademas vienen limpios gracias al middleware validate Product
        let { nombre, email, password, es_admin} = req.body; // destructuring

        // bcrypt 1: vamos a hashear el nuevo password del admin 
        const saltRounds = 10;   // cantidad de rondas de cifrado / de hasheado que hara
        const hashedPassword = await bcrypt.hash(password, saltRounds); // aca el password ya esta hasheado codificado


        if(es_admin == 0){
            es_admin = 1;
        }

        const [rows] = await AuthModels.createUser(nombre, email, hashedPassword, es_admin);
        // 3. Respuesta de exito (201 Created)
        res.status(201).json({
            message: "Usuario creado con exito.",
            userId: rows.insertId
        });
    }
    catch(error){
        console.log(error);
        // Devolvemos un codigo 500 Internal sv error
        res.status(500).json({
            message: "Error interno del servidor"
        });
    }
}