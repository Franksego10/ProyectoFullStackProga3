// ===========================================
//      Controladores de Autentificacion
// ===========================================

export const loginView = async (req, res) => {
    res.render("login", {
        title: "Login",
        about: "Iniciar Sesión",
        tituloAccion: "Librería Dominico",
        descripcion: "Inicia sesion para poder ingresar al dashboard y realizar acciones"

    });
}