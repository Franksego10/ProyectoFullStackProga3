// ===========================================
//      Controladores de Autentificacion
// ===========================================
import AuthModels from "../models/auth.models.js"
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
            return res.render("login");
        }

        // TO DO mandar error a la vista login
        
        const [rows] = await AuthModels.selectUser(email, password);

        // TO DO Creamos mensaje de error si no existe el user admin

        const user = rows[0];
        console.table(user);

        // Una vez que recibimos a nuesstro usuario admin vamos a crear una sesion
        req.session.user = {
            id: user.id,
            nombre: user.nombre,
            correo: user.correo
        }

        res.redirect("/dashboard/index");
    }
    catch(error){

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