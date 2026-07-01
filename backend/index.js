/////////////////////
// Importaciones
import express from "express";
import environment from "./src/api/config/environment.js"; // importamos los datos de la BD
// import connection from "./src/api/database/db.js"; // importamos pool de conexiones // ya no lo necesitamos porque esta en product.routes.js
import { authRoutes, productRoutes, userRoutes, viewRoutes} from "./src/api/routes/index.js";
import cors from "cors"; // da permiso a las solicitudes / peticiones
import { loggerURL } from "./src/api/middlewares/middlewares.js";
// importamos la configuracion para trabajar con rutas de utils
import {__dirname, join} from "./src/api/utils/index.js";
import session from "express-session"; // importamos session
import { connectDatabase } from "./src/api/database/sequelize.js";

// con destructuring extraemos las variables port y session_key de environment
const {port, session_key} = environment;

const app = express();

//---------------------------------------------------------------------------------------------------------------------

/////////////////////
// Config
const PORT = port; // puerto de la base de datos

//---------------------------------------------------------------------------------------------------------------------

/////////////////////
// Middlewares

// Middleware basico para permitir todas las solicitudes
app.use(cors()); 

// Middleware para parsear JSON del body en las solicitudes POST y PUT a Objeto JS
app.use(express.json());

// Middleware para parsear info enviada de forma nativa con <form>
app.use(express.urlencoded({
    extended: true
}));

app.use(loggerURL);

app.use(express.static(join(__dirname, "src/public")));

app.set("view engine", "ejs");

app.set("views", join(__dirname, "src/views"));

/*
==================================================
            Trabajando con sesiones
==================================================
El protocolo HTTP es un protocolo "stateless" (sin estado), esto significa que no sabe quienes somos o no recuerda entre peticiones, 
cada peticion es interpretada como una nueva.
EL middleware express session permite que express recuerde datos entre peticiones. Porque sin sesiones no hay forma de saber si el usuario 
este logueado, a mnos que usemos tokens(JWT), cookies firmadas o mecanismos como express.

---




Gracias a express session cuando iniciemos sesion exitosamente

    1. Guardara algo como: 
            req.session.user = {id: 10, name: "Franco"}

    2. Gracias a esta sesion iniciada podremos acceder a las rutas.

    3. La manera de proteger las rutas(evitar que un usuario no logueado acceda a nuestro panel de administracion, el dashboard), para las prox requests necesitaremos comprobar que si no hay una sesion iniciada, entonces volveremos al login
            if(!req.session.user){
                return res.redirect("/login");          Protege el acceso al dashboard.
            }
    
    4. Para evitar escribir esto en cada controlador lo delegamos en un middleware de ruta (evitando asi repetir codigo).

    5. Cuando creamos una sesion esta necesita protegerse con una contraseña. Esta permitira que no se puedan: 
            - Falsificar una sesion
            - Modificar una sesion
            - Robar una identidad
    
    Creamos una contraseña con https://secretkeygen.vercel.app/ 

    6. Guardamos esta contra en el .env y la leemos en el environment.js para exportarla y usarla aca.
            Guardamos la clave en el .env para que no este expuesta en el repositorio asi nadie las robe o la falsifique
    
========================================
    Entendiendo el codigo de abajo
========================================

    app.use(session({

    }))
    app.use es un middleware que se ejecuta en todas las rutas de la aplicacion
    aca estamos aplicado el middleware express-session a la aplicacion, esto significa que cada vez que un usuario realice una peticion HTTP, se gestionara su gestion mediante el middleware

    secret: session_key
        secret es clave porque se usa para firmar la sesion, asegurando que los datos de la sesion no sean modificados por el cliente, esto es fundamental para la seguridad de la aplicacion
        Sin el secret la sesion seria vulnerable a ataques a de modificacion de datos, por eso el valor de sesion_key debe ser una cadena de caracteres aleatoria y secreta (nunca algo predecible)
        Este valor se usa para firmar las cookies de sesion de manera que el servidor pueda verificar que los datos no fueron alterados por el cliente

    resave: false
        Determina si la sesion debe guardarse de nuevo en el almacenamiento de la sesion cada vez que se realice una solicitud
        Si se establece en false solo se guarda la sesion si hubo cambios en los datos de la sesion
        Si se establece en true la sesion se guarda de nuevo en cada solicitud incluso si no hubo cambios, esto genera un gasto innecesario de recursos, por eso usualmente lo establecemos en false
    
    saveUnitialized: true
        Controla si las sesiones no inicializadas(sesiones sin datos) se deben guardar
        Si se establece en true se guarda la sesion incluso si no tiene datos (por ejemplo: en el caso de un user recien creado)
        Si se establece en false las sesiones vacias no se almacenan. Esto podria ser util para evitar el almacenamiento innecesario de sesiones para usuarios que no interactuan con la aplicacion de manera significativa
        Por lo general se recomienda establecerlo en true para garantizar que la sesion se cree desde el inicio ya que muchos sistemas requieren que haya un identificador presente aunque este vacio
*/

// definimos los objetos que va a tener la sesion
app.use(session({
    secret: session_key, // firma las cookies para evitar la manipulacion, debe ser aleatoria ya que debe ser segura
    resave: false,       // evita guardar la sesion si es que no hubo cambios
    saveUninitialized: true // no guarda sesiones vacias

}))

//---------------------------------------------------------------------------------------------------------------------

/////////////////////
// Endpoints

app.get("/", (req, res) => {
    res.send("Libreria Dominico");
});

// RUTAS
app.use("/productos", productRoutes); // product.routes.js es un middleware / rutas de productos

// RUTAS DE VISTAS
app.use("/dashboard", viewRoutes);

// RUTA DE LOGIN
app.use("/login", authRoutes);

// RUTA DE USUARIO
app.use("/usuarios", userRoutes);

await connectDatabase()

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});