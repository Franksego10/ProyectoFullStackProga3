const postProductForm = document.getElementById("postProduct-form");
const contenedorProductos = document.getElementById("contenedor-productos")

    //  Validamos previamente los datos en el cliente
function validarFormulario(data) {
    const errores = [];

    // Nombre
    if (!data.nombre || data.nombre.trim().length < 2) {
        errores.push("El nombre debe tener al menos 2 caracteres");
    }

    // Precio
    if (!data.precio || isNaN(data.precio) || Number(data.precio) < 0) {
        errores.push("El precio debe ser un numero mayor a 0");
    }
    
    // Stock
    if (!data.stock || isNaN(data.stock) || Number(data.stock) < 0) {
        errores.push("El stock debe ser un numero mayor a 0");
    }
    
    // Categoria
    if (!data.categoria) {
        errores.push("Debe seleccionarse una categoria");
    }

    return errores;
}

postProductForm.addEventListener("submit", async event => {
    event.preventDefault();

    const formularioAlta = event.target;

    // Obtenemos la data del formulario
    const formData = new FormData(formularioAlta);
    console.log(formData)

    // Parseamos el objeto FormData a un objeto JS normal para enviarlo en el body con JSON.stringify()
    const data = Object.fromEntries(formData.entries());
    console.log(data); // {name: 'Milanesa con pure', image: 'https://external-content.duckduckgo.com/iu/?u=http…6e45b50cd5d36060579357952f993b359785aa40496b7b8cd', category: 'food', price: '400'}
    
    // formData devuelve todos los datos como string por eso tenemos q parsear los numeros nuevamente
    data.precio = Number(data.precio);
    data.stock = Number(data.stock);
    
    const errores = validarFormulario(data);
    if(errores.length > 0){
        mostrarMensaje("error", errores.join("<br>"));
        return
    }

    try {
        const response = await fetch("http://localhost:3002/productos/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        // Manejamos respuestas no OK del sv
        if(!response.ok){
            mostrarMensaje("error", result.message);
            return;
        }
        
        // mostramos mensaje de exito
        const infoProducto = `${result.message} con id ${result.productId}`;
        mostrarMensaje("exito", infoProducto)
        console.log(infoProducto);

        formularioAlta.reset(); // reseteamos los inputs del formulario

    } catch (error) {
        console.error("Error al enviar los datos: ", error);
        mostrarMensaje("error", "Error de conexion con el servidor")
    }
});
function mostrarMensaje(tipo, mensaje) {
    contenedorProductos.innerHTML = `
        <p class="mensaje mensaje-${tipo}">${mensaje}</p>
    `;
}