const contenedorProductos = document.getElementById("contenedor-productos");
const getProductForm = document.getElementById("getProduct-form"); // El contenedor donde ingresamos el id
const urlBase = "http://localhost:3002/productos";

getProductForm.addEventListener("submit", async event => {
    event.preventDefault(); //evitamos el envio por defecto

    // Extraemos el id del producto
    const idProd = event.target.idProd.value.trim();
    
    // Nos aseguremos que el id sea valido
    if (!idProd) {
        mostrarError("Ingresá un id válido");
        return;
    }

    try {
        const response = await fetch(`${urlBase}/${idProd}`);
        console.log(response);

        //parseamos los datos que devuelve el sv
        const datos = await response.json();

        // Mostramos por pantalla el error 400 o 500 si lo devuelve el sv
        if(!response.ok){
            mostrarError(datos.message);
            return;
        }

        const producto = datos.payload[0];
        console.log(producto);

        renderizarProducto(producto);

    }
    catch(error){
        console.error("Error al obtener el producto");

        // Mostramos errores de red
        mostrarError("Error de conexion con el servidor");
    }
});

function renderizarProducto(producto){
    const htmlProducto = `
        <ul>
            <li class="lista-producto">
                <img src="${producto.pathImagen}" alt="${producto.nombre}">
                <p>Id: ${producto.id} / Nombre: ${producto.nombre} / <strong>Precio: $${producto.precio}</strong></p>
                <input type="button" id="deleteProduct-button" value="Eliminar Producto">
            </li>
        </ul>
    `;
    
    contenedorProductos.innerHTML = htmlProducto;

    const deleteProductButton = document.getElementById("deleteProduct-button");

    deleteProductButton.addEventListener("click", event => {
        event.stopPropagation();
        
        const confirmacion = confirm("¿Seguro que quieres elimnar el producto?");

        if(!confirmacion){
            alert("Operacion cancelada")
        }else{
            eliminarProducto(producto.id);
        }
    });
}

function mostrarError(mensaje) {
    contenedorProductos.innerHTML = `
        <p class="mensaje mensaje-error">${mensaje}</p>
    `;
}

function mostrarExito(mensaje) {
    contenedorProductos.innerHTML = `
        <p class="mensaje mensaje-exito">${mensaje}</p>
    `;
}


// funcion para realizar una operacion delete
async function eliminarProducto(id){
    try{
        const response = await fetch(`${urlBase}/${id}`, {
            method: "DELETE"
        });

        const result = await response.json();

        // Manejamos error 400 500
        if (!response.ok) {
            mostrarError(result.message);
            return;
        }

        // En lugar de un alert bloqueante, mostramos un mensaje de exito, similar el mensaje de error
        console.log(result.message);

        // Mensaje de exito;
        // reemplazamos el producto por el mensaje, asi que no hace falta limpiarlo
        mostrarExito(result.message);
        // Limpiamos visualmente el producto que eliminamos de la pantalla
        // contenedorProductos.innerHTML = "";
    }
    catch(error){
        console.error("Error en la solicitud DELETE: ", error);
        alert("Ocurrio un error al eliminar un producto")
    }
}
