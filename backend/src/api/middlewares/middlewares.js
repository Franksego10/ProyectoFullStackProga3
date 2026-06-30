/*
=============================
        Middlewares
=============================
*/


// Middleware logger (de aplicacion) para analizar todas las solicitudes por consola (tener el historial del consumo de nuestra Api REST en la consola)
const loggerURL = ((req, res, next) => {
    let fecha = new Date();
    console.log(`[${fecha.toLocaleDateString()} ${fecha.toLocaleTimeString()}] ${req.method} ${req.url}`);
    
    next(); // next() da paso a que continue la respuesta o el siguiente middleware (en caso de haberlo)
});


// Middleware de ruta (se aplica en algunos endopoints)
const validateId = (req, res, next) => {
    const id = Number(req.params.id); // transformo el id pasado por la url a numero

    // si no es entero o es un numero negativo, devuelvo una respuesta 400 (Bad Request)
    if (!Number.isInteger(id) || id <= 0){
        return res.status(400).json({
            message: "Ingrese un id valid (numero entero y positivo)"
        });
    }

    // si no entro al error se sigue ejecutando el codigo
    // incorporamos el id a la request
    req.id = id;
    next(); // Seguimos con el siguiente middleware si existe o vamos a procesar la response
}

// Middleware de ruta para validar los campos de un formulario POST
const categoriasValidas = ["comic","libro"] // aca ponemos las 2 categorias de lo que venderemos
const validateProduct = (req, res, next) => {
    // Capturamos los datos del req.body que vienen del formulario
    const { nombre, descripcion, precio, stock, categoria} = req.body;

    // Array vacio de errores
    const errores = [];
//Comic != comic
    if(!nombre || !descripcion || !categoria || !precio || stock === undefined){
        errores.push("Datos invalidos, asegurate que todos los campos esten llenos")
    }

    if(typeof nombre !== "string" || nombre.trim().length < 2){
        errores.push("El nombre debe tener al menos 2 caracteres");
    }

    if (typeof precio !== "number" || precio < 0){
        errores.push("El precio debe ser un numero mayor a 0");
    }

    if (typeof stock !== "number" || stock < 0){
        errores.push("El stock debe ser un numero mayor a 0");
    }

    if (!categoriasValidas.includes(categoria.toLowerCase())){
        errores.push("Categoria Invalida");
    }

    // Detectamos si exisste algun error en la lista y lo devolvemos en un 400
    if (errores.length > 0){
        return res.status(400).json({
            message: "Datos Invalidos: " + errores
        });
    }
    
    next();
}

// Middleware de Proteccion de rutas

const requireLogin = (req, res, next) => {
    // Si no existe una sesion entonces volvemos a la pantalla del login
    if(!req.session.user){
        return res.redirect("/login")
    }
    
    next();
}


export {
    loggerURL,
    validateId,
    validateProduct,
    requireLogin
}