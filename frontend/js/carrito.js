let listaCarrito = []
let cantidadStockCarrito = 0;
cargarCarrito()

function guardarCarrito(){
    sessionStorage.setItem("carrito", JSON.stringify(listaCarrito))
}
function cargarCarrito(){
    const carritoSessionStorage = sessionStorage.getItem("carrito");
    if(carritoSessionStorage){
        listaCarrito = JSON.parse(carritoSessionStorage);
        mostrarCarrito()
        console.log("Cargamose el carrito")
    }
}

function agregarProductoCarrito (producto){
    console.trace("--------------------"); 
    console.trace("agregarProductoCarrito llamada"); 
    console.trace("--------------------"); 
    const existeProducto = existeProductoCarrito(producto.id)

    if (existeProducto){
        existeProducto.cantidad += 1;
    }
    else{
        let productoAgregado = {...producto, cantidad: 1}    // esto crea una copia del producto y le agrega un campo cantidad
        listaCarrito.push(productoAgregado); // lo agrega a un array carrito 
    }
    console.log(listaCarrito);                                       // me muestra el array carrito en consola
    mostrarCarrito();                                                // muestra el carrito en la pagina actualizado
    guardarCarrito(listaCarrito);                                    // guarda el carrito actualizado
}

function existeProductoCarrito(idProd){
    return listaCarrito.find((productoCarrito) => productoCarrito.id === idProd) //Esto me devuelve: o el objeto (si existe) o undefined ( si no existe)
}

function mostrarCarrito(){
    // 1. ACTUALIZAMOS EL CONTADOR DEL HEADER (¡Siempre arriba de todo!)
    const totalProductos = listaCarrito.reduce((acc, element) => acc + element.cantidad, 0);
    document.getElementById("contador-carrito").innerText = totalProductos;


    let contenedorCarrito = document.getElementById("items-carrito");
    
    if(listaCarrito.length == 0){
        contenedorCarrito.innerHTML = `<p>No hay elementos en el carrito.</p>`;
        return;
    }

    let totalPrecio = sumarTotalPrecioCarrito().toFixed(2);

    let carritoProdHTML = `
    <div class='contenedor-botones-carrito'>
        <h2 class="titulo-contenedor-productos">Productos en el carrito</h2>
        <button class='boton-vaciar' onclick='vaciarCarrito()'>
            <span class="texto-vaciar">Vaciar carrito</span>
            <span class="icono-vaciar">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
            </span>
        </button>
        <span class="texto-carrito">Total:<span id="contenedor-totalPrecio">$${totalPrecio}</span> </span>
        <button class='boton-comprar' onclick="imprimirTicket()" id="btn-comprar">Comprar</button>
    </div>
    <ul>
    `;
    listaCarrito.forEach(element => {
        carritoProdHTML += `
            <li class="bloque-item">
                <p class="nombre-item">${element.nombre} - $${element.precio}</p>
                <div class="modificar-cantidad">
                    <button class="boton-sumar" onclick="sumarCantidadProducto(${element.id})" id="${element.id}">+</button>
                    <span class="texto-carrito">${element.cantidad}</span>
                    <button class="boton-restar" onclick="restarCantidadProducto(${element.id})" id="${element.id}">-</button>
                </div>
            </li>
        `;
    });
    carritoProdHTML += "</ul>";
    contenedorCarrito.innerHTML = carritoProdHTML;
}
// }
// const botonHTML = document.getElementById("btn-comprar")
// botonHTML.addEventListener("click", imprimirTicket)

async function imprimirTicket() {
    let productosVenta = [];
    
    for (const producto of listaCarrito) {
        const stockDisponible = producto.stock;
        const cantidadPedida = producto.cantidad;

        if (stockDisponible < cantidadPedida) {
            if (stockDisponible === 0) {
                // Evitamos comprar si por algun error en la base de datos no hay stock y el producto sigue activo
                alert(`"${producto.nombre}" no tiene stock disponible y fue removido de tu compra.`);
                borrarProductoID(producto.id);
                mostrarCarrito();
                guardarCarrito();
                return;
            }

            // Stock insuficiente pero algo hay, 
            const confirmado = confirm(
                `Solo quedan ${stockDisponible} unidades de "${producto.nombre}".\n¿Desea comprar todo el stock habil?`
            );

            if (confirmado) {
                producto.cantidad = stockDisponible; // reemplazamos la cantidad
                guardarCarrito();
                mostrarCarrito();
            } else {
                return; // el usuario canceló, no hacemos nada
            }
        }

        productosVenta.push({
            idProducto: producto.id,
            cantidadProducto: producto.cantidad
        });
    }

    // Recalculamos el precio total por si cambiaron cantidades
    const precioTotal = sumarTotalPrecioCarrito().toFixed(2);
    const nombreUsuario = sessionStorage.getItem("cliente-nombre");

    // Generamos el PDF
    generarPDF(precioTotal, nombreUsuario);

    // Registramos la venta
    registrarVenta(precioTotal, productosVenta, nombreUsuario);
}

function generarPDF(precioTotal, nombreUsuario){

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    let y = 40;

    doc.setFontSize(32);
    doc.text("Libreria dominico - Ticket de compra", 15, y);

    y += 25;

    doc.setFontSize(16);

    listaCarrito.forEach((p) => {
        doc.text(`${p.cantidad} Uds - ${p.nombre} - ${p.precio} c/u`, 60, y);
        y += 20;
    });

    y += 10;

    doc.setFontSize(24);
    doc.text(`Total: ${precioTotal}`, 40, y);

    let fecha = new Date();
    doc.save(`ticket-${nombreUsuario}-${fecha.toISOString()}.pdf`);
}


async function registrarVenta(precioTotal, productosVenta, nombreUsuario) {
    // toLocalString vs toISOString

    // Los metodos local e ISO tienen diferentes propositos a la hora de convertir un objeto Date a una cadena
    // El metodo ISO siempre devuelve una cadena en formato ISO8601, que representa la fecha y la hora que UTC, este formato esta estandarizado y es coherente
    // independientemente de la configuracion del sistema
    
    // Por el contrario local devuelve una cadena formateada segun la configuracion regional (la zona horaria del sistema del usuario) o segun especificado por los parametros
    // del metodo. Es decir que el resultado puede variar segun la ubicacion del usuario

    // Una solucion habitual para obtener la hora local en formato ISO8601(Sin la 'Z') es ajustar la fecha segun la diferencia horaria antes de llamar a toISOString

    // Esto se puede hacer restando la diferencia horaria en milisegundos (obtenida mediante «getTimezoneOffset () * 60000») del valor de la hora de la fecha. A continuación, la cadena resultante se puede modificar para eliminar la «Z» final si es necesario. Alternativamente, el uso de una configuración regional como «sv» (Suecia) con «toLocaleString()» produce un formato similar al ISO 8601, aunque utiliza un espacio en lugar de «T» entre la fecha y la hora, lo que sigue siendo válido según la RFC 3339.

    // Ya que el formato fecha no es valido para timeStamp en SQL, tenemos que formatear
    const fecha = new Date().toLocaleString("sv-SE", {hour12:false}).replace("T", " ")
    console.log("FECHA: " + fecha)

    // Contruimos el objeto con informacion para mandarselo al endPoint (previo parseo a JSON)
    const data = {
        fecha: fecha,
        precio_total: precioTotal,
        nombre: nombreUsuario,
        productos: productosVenta
    }

    
    const response = await fetch("http://localhost:3002/ventas", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(data)
    })
    
    const result = await response.json();


    if(response.ok){
        alert(result.message);
        // Limpieza de variables en sesion y redirreccion para resetear la APP
        sessionStorage.removeItem("carrito");
        sessionStorage.removeItem("cliente-nombre");

        window.location.href = "bienvenida.html"
    }else{
        alert(result.message)
    }
}


function sumarCantidadProducto(idProd){
    const productoCarrito = existeProductoCarrito(idProd)
    console.log(productoCarrito)
    if(productoCarrito == undefined){
        return
    }
    
    productoCarrito.cantidad += 1;
    console.log("stock" + productoCarrito.cantidad)
    guardarCarrito()
    mostrarCarrito()
}

function restarCantidadProducto(idProd){
    const productoCarrito = existeProductoCarrito(idProd)
    console.log(productoCarrito)
    if(productoCarrito == undefined){
        return
    }
    

    if(productoCarrito.cantidad <= 1){
        borrarProductoID(productoCarrito.id);
        guardarCarrito();
        mostrarCarrito();
        return;
    }
    productoCarrito.cantidad -= 1;
    guardarCarrito();
    mostrarCarrito();
}

function sumarTotalPrecioCarrito(){
    return listaCarrito.reduce((acc, producto) => acc += parseFloat((producto.precio * producto.cantidad)), 0);
}

function borrarProductoID(idProd){
    const productoCarrito = existeProductoCarrito(idProd);
    if(productoCarrito){
        const indice = listaCarrito.findIndex((element) => element.id === idProd);
        listaCarrito.splice(indice, 1);
    }
}

function vaciarCarrito(){
    listaCarrito.length = 0;
    mostrarCarrito();
    guardarCarrito();
}