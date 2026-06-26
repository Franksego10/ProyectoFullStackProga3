const contenedorProductos = document.getElementById("contenedor-productos");
const getProductForm = document.getElementById("getProduct-form"); // El contenedor donde ingresamos el id
const putProductForm = document.getElementById("putProduct-form"); // El contenedor donde estara el formulario para acualizar los datos
const urlBase = "http://localhost:3002/productos";

// Escuchamos cuando hacen click en consultar producto
getProductForm.addEventListener("submit", async event => {
    event.preventDefault(); // Evitamos el envio por defecto de HTML del form submit

    // Extraemos el id del producto
    const idProd = event.target.idProd.value.trim();
    
    // nos aseguramos que se haya enviado un id valido
    if (!idProd) {
        mostrarMensaje("error", "Ingresá un id válido");
        return;
    }

    try{
        const response = await fetch(`${urlBase}/${idProd}`);
        console.log(response);

        // Procesamos los datos que devuelve el servidor y los transformamos a objeto o arreglo
        const datos = await response.json();
        console.log(datos);

        // mostramos por pantalla el error 400 o 500 que nos devuelve el server
        if(!response.ok){
            mostrarMensaje("error", datos.message);
            return;
        }

        // guardamos el producto
        const producto = datos.payload[0];
        console.log(producto);

        // Mostramos el producto por pantalla
        renderizarProducto(producto);
    }
    catch(error){
        console.error("Error al obtener producto");

        //mostramos el error de red
        mostrarMensaje("error", "Error de conexion con el servidor")
    }
})


function renderizarProducto(producto){
    const htmlProducto = `
        <ul>
            <li class="lista-producto">
                <img src="${producto.pathImagen}" alt="${producto.nombre}">
                <p>Id: ${producto.id} / Nombre: ${producto.nombre} / <strong>Precio: $${producto.precio}</strong></p>
                <input type="button" id="updateProduct-button" value="Actualizar Producto">
            </li>
        </ul>
    `;
    
    contenedorProductos.innerHTML = htmlProducto;

    const updateProductButton = document.getElementById("updateProduct-button");

    updateProductButton.addEventListener("click", event => {
        event.stopPropagation();
        
        const confirmacion = confirm("¿Queres actualizar el producto?");

        if(!confirmacion){
            alert("Actualizacion cancelada")
        }else{
            formularioPutProducto(event, producto);
        }
    })    
}

function mostrarMensaje(tipo, mensaje) {
    console.log(putProductForm);
    console.log(contenedorProductos);
    putProductForm.innerHTML = "";
    contenedorProductos.innerHTML = `
        <p class="mensaje mensaje-${tipo}">${mensaje}</p>
    `;
}

async function formularioPutProducto(event, producto){
    event.stopPropagation(); // evitamos la propagacion de evento
    console.table(producto); // comprobamos que el producto existe correctamente

    // Reciclo form de crear producto
    const htmlForm = `
        <form id="updateProduct-form">
    
            <input type="hidden" name="id" value="${producto.id}">

            <label for="nameProd">Nombre del producto</label>
            <input type="text" name="nombre" id="nameProd" value="${producto.nombre}" required>

            <label for="nameProd">Descripcion</label>
            <input type="text" name="descripcion" id="descripcionProd" value="${producto.descripcion}" required>

            <label for="priceProd">Precio</label>
            <input type="number" name="precio" id="priceProd" value="${producto.precio}" required>

            <label for="stockProd">Stock inicial</label>
            <input type="number" name="stock" id="stockProd" value="${producto.stock}" required>

            <label for="nameProd">Categoria</label>
            <input type="text" name="categoria" id="categoriaProd" value="${producto.categoria}" required>

            <label for="nameProd">Direccion de enlace de la imagen</label>
            <input type="text" name="imagen" id="pathProd" value="${producto.pathImagen}" required>

            <label for="activeProd">Activo</label>
            
            <select name="active" id="activeProd">
                <option value="1" ${producto.activo ? 'selected' : ''}>activo</option>
                <option value="0" ${!producto.activo ? 'selected' : ''}>inactivo</option>
            </select>

            <input type="submit" value="Actualizar producto">

        </form>
        `;
    putProductForm.innerHTML = htmlForm;
    
    // Selecciono el formulario de actualizacion
    const updateProductForm = document.getElementById("updateProduct-form");

    updateProductForm.addEventListener("submit", event => {
        actualizarProducto(event);
    });
}   

// Enviamos los datos del formulario al servidor

async function actualizarProducto(event){
    event.preventDefault();
    console.log(event.target); // Nos muestra por consola el formulario de actualizacion

    // Recojo los datos del formulario (del evento) en un objeto nativo FormData
    const formData = new FormData(event.target);
    console.log(formData);

    const data = Object.fromEntries(formData.entries());
    console.log(data);
    console.log(JSON.stringify(data)); // esto le vamos a enviar al endpoint

    try{
        const response = await fetch(urlBase, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        console.log(response);
        const result = await response.json();

        // Filtramos respuesta no ok
        if(!response.ok) {
            mostrarMensaje("error", result.message);
            return;
        }

        mostrarMensaje("exito", result.message);
    }
    catch(error){
        console.error(error);
        mostrarMensaje("error", error);
    }
}