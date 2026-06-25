//Gestionar la logica para trabajar con archivos y rutas de proyecto

import {fileURLToPath} from "url"; //Convierte la URL archivo_file a ruta de sistema
import {dirname, join} from "path"; //dirname devuelve el directorio padre y join une segmentos de ruta

// Obtener el nombre del archivo actual
const __filename = fileURLToPath(import.meta.url); //Proporciona la URL absoluta del modulo actua, ycon fileURLToPath convertimos la URL a una ruta del sistema

// Obtenemos el directorio del archivo actual
const __dirname = join(dirname(__filename), "../../../"); //Salimos de la carpeta UTILS, API y SRC

export{
    __dirname,
    join
}