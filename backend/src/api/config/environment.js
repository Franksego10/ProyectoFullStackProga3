// Importamos el modulo dotenv para leer las variables de entorno
import dotenv from "dotenv";

dotenv.config(); // Cargamos las variables de entorno
// Esto hace que podamos leer el contenido de las variables con process.env.NOMBRE

export default {
    port: process.env.PORT || 4000,
    session_key: process.env.SESSION_KEY,
    database: {
        host: process.env.DB_HOST,
        name: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD
    }
}