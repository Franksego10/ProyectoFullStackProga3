/*
===================================
    MODELOS DE AUTENTIFICACION
===================================
*/

import sequelize from "../database/sequelize.js";
import { DataTypes } from "sequelize";

const User = sequelize.define("usuarios", {
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    correo:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{isEmail:{mensaje:"Debe ingresar una direccion de correo valida."}},
        unique:true
    },
    contrasena:{
        type: DataTypes.STRING,
        allowNull: false,
        unique:true
    },
    es_admin:{
        type:DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue:1
    },
    nombre:{
        type:DataTypes.STRING,
        allowNull: false,
    }
})



const selectUser = async (emailUser) => {
    const rows = await User.findAll({where: {correo : emailUser}})
    return [rows];
}

const createUser = async (nombre, email, password, es_admin) =>{
    const usuarioCreado = await User.create({
        correo: email,
        contrasena: password,
        es_admin,
        nombre
    });
    return [{insertId : usuarioCreado.id}];
}

export default {
    selectUser,
    createUser
}