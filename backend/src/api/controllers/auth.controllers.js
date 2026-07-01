// ===========================================
//      Controladores de Autentificacion
// ===========================================
import AuthModels from "../models/auth.models.js"
import bcrypt from "bcrypt"

export const loginView = async (req, res) => {
    res.render("login", {
        title: "Login",
        about: "Iniciar Sesión",
        tituloAccion: "Librería Dominico",
        descripcion: "Inicia sesion para poder ingresar al dashboard y realizar acciones"

    });
}

// Procesamos los datos del login del <form>
export const processLoginInfo = async(req, res) => {
    try{
        // recibimos los datos de los campos email y password del form nativo, que gracias al middleware de parseo urlencoded ya entra a este endpoint como objeto js.
        const {email, password} = req.body;

        // evitamos una consulta innecesaria 
        if(!email || !password){
            return res.render("login", {
                title: "Login",
                tituloAccion: "Libreria Dominico",
                descripcion: "Introduci tus datos para poder ingresar",
                about: "Iniciar sesión",
                error: "Faltan campos en el formulario"
            });
        }

        
        const [rows] = await AuthModels.selectUser(email);

        
        // Creamos mensaje de error si no existe el user admin
        if(rows.length === 0){
            return res.render("login", {
                title: "Login",
                tituloAccion: "Libreria Dominico",
                descripcion: "Introduci tus datos para poder ingresar",
                about: "Iniciar sesión",
                error: "Credenciales invalidas. Usuario no encontrado"
            });
        }
        
        const user = rows[0];
        console.table(user);
        
        // validacion si el usuario esta dado de baja
        if (!user.es_admin){
            return res.render("login", {
                title: "Login",
                tituloAccion: "Libreria Dominico",
                descripcion: "Introduci tus datos para poder ingresar",
                about: "Iniciar sesión",
                error: "Credenciales invalidas. Usuario ya no es admin"
            });
        }

        // comparamos el password hasheado que se escribio en el input con el password encriptado de la base de datos
        const match = await bcrypt.compare(password, user.contrasena);

        // bcrypt 3: Si coinciden los hashes match devuelve true y continuamos con el login
        if(match){

            // Una vez que recibimos a nuesstro usuario admin vamos a crear una sesion
            req.session.user = {
                id: user.id,
                nombre: user.nombre,
                correo: user.correo
            }

            res.redirect("/dashboard/index");
        }
        else {
            res.render("login", {
                title: "Login",
                tituloAccion: "Libreria Dominico",
                descripcion: "Introduci tus datos para poder ingresar",
                about: "Iniciar sesión",
                error: "Contraseña invalida. Ingrese una correcta"
            })
        }

        
        
    }
    catch(error){
        console.log(error);
        res.status(500).json({
            message: "Error interno del servidor"
        });
    }
}

////////////////////////////
// Cerramos la sesion
export const destroyLogin = (req, res) => {
    req.session.destroy((error) => {
        if(error){
            console.log("Error al cerrar sesion", error);
            return res.status(500).json({
                message: "Error interno del servidor"
            })
        }
        res.redirect("/login"); // destruida la sesion exitosamente redirigimos a vista login
    })
}