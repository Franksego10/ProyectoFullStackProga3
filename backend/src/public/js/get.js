const contenedorProductos = document.getElementById("contenedor-productos");
const getProductForm = document.getElementById("getProduct-form");
const urlBase = "http://localhost:3002/productos";


getProductForm.addEventListener("submit", async event => {
    event.preventDefault(); // Evitamos el envio por defecto del formulario

    // Optimizacion 1: Para extraer solamente un valor, como el id en nuestro miniformulario, podemos saltarnos el FormData + Object.fromEntries
    const idProd = event.target.idProd.value.trim();

    // Optimizacion 2: Nos aseguramos de que se haya enviado un id valido
    if (!idProd) {
        mostrarError("Ingresá un id válido");
        return;
    }
    
    /*
    // Creo un objeto nativo FormData a partir del formulario del evento
    const formData = new FormData(event.target);
    console.log(formData); // FormData { idProd → "1" }

    // Transformo mi objeto nativo FormData en un objeto normal JS
    const data = Object.fromEntries(formData.entries());
    console.log(data); // Object { idProd: "1" }
    const idProd = data.idProd; // 1
    */


    try {
        // Optimizacion 3: Guardamos en una variable aparte la URL base para no hardcodearla aca
        const response = await fetch(`${urlBase}/${idProd}`);
        console.log(response);

        const data = await response.json();

        // Optimizacion 4: Mostramos por pantalla el error (400 o 500) que nos devuelve el servidor
        if (!response.ok) {
            mostrarError(data.message);
            return;
        }

        console.log(data.payload[0]); // {id: 41, name: 'Fernetazo Chabona', image: 'https://pointlaventanita.com/wp-content/uploads/2024/05/chabona.webp', category: 'drink', price: '2300.00', …}

        const producto = data.payload[0];

        const htmlProducto = `
            <ul>
                <li class="lista-producto">
                    <img src="${producto.pathImagen}" alt="${producto.nombre}">
                    <p>Id: ${producto.id} / Nombre: ${producto.nombre} / <strong>Precio: $${producto.precio}</strong></p>
                </li>
            </ul>
        `;

        contenedorProductos.innerHTML = htmlProducto;

    } catch (error) {
        console.error("Error al obtener productos: ", error);

        // Optimizacion 5: Mostramos errores de red (en el try catch del fetch no capturamos errores 400 o 500)
        mostrarError("Error de conexion con el servidor")
    }
})

function mostrarError(mensaje) {
    contenedorProductos.innerHTML = `
        <p class="mensaje mensaje-error">${mensaje}</p>
    `;
}