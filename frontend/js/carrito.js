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
    console.log("Apretamos el boton")
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
        <button class='boton-vaciar' onclick='vaciarCarrito()'>Vaciar carrito</button>
        <span>Total:<span id="contenedor-totalPrecio">$${totalPrecio}</span> </span>
        <button class='boton-comprar' id="btn-comprar">Comprar</button>
    </div>
    <ul>
    `;
    listaCarrito.forEach(element => {
        carritoProdHTML += `
            <li class="bloque-item">
                <p class="nombre-item">${element.nombre} - $${element.precio}</p>
                <div class="modificar-cantidad">
                    <button class="boton-sumar" onclick="sumarCantidadProducto(${element.id})" id="${element.id}">+</button>
                    <span>${element.cantidad}</span>
                    <button class="boton-restar" onclick="restarCantidadProducto(${element.id})" id="${element.id}">-</button>
                </div>
            </li>
        `;
    });
    carritoProdHTML += "</ul>";
    contenedorCarrito.innerHTML = carritoProdHTML;
}
const botonHTML = document.getElementById("btn-comprar")
botonHTML.addEventListener("click", imprimirTicket)

function imprimirTicket(){
    //1.Imprimir ticket con los datos del producto
        // Gracias al CDN ya podemos usar todas las funcionalidades de JsPDF 
        // Para registrar las ventas despues, guardaremos los ID's de los productos del carrito
    let idProductos = [];

    // Gracias a CND, extraemos la clase de JsPDF del objeto global window
    const {jsPDF} = window.jspdf;
    // Creamos una nueva instancia del document usando la clase JsPDF
    const doc = new jsPDF(); //En DOC inicializamos todos los metodos para crear PDFs

    // Definimos el margen superior en el eje Y -> eje vertical, el eje X -> eje horizontal
    let y = 40;
    
    // Establecemos el tamaño de 32 pixeles para el primer texto:
    doc.setFontSize(32)
    doc.text("Libreria dominico - Ticket de compra", 15, y) // Escribimos el ticket de compra en la posicion x=80 | y=40

    // Definimos el espacio despues del titulo
    y += 25;
    
    //Definimos el tamaño de fuente para los productos del ticket
    doc.setFontSize(16);

    // iteramos el carrito e imprimimos nombre y precio
    listaCarrito.forEach((producto) => {
        idProductos.push(producto.id) //Llenamos el array de IdProductos para registrar la venta despues
        doc.text(`${producto.cantidad}Uds: ${producto.nombre} / $${producto.precio} c/u`, 60, y); //20uds: carbon / $20.000 c/u 
        y += 20;
    })//Creamos el texto por cada producto en la listaCarrito

    // Calculamos el precio total del ticket
    const precioTotal = sumarTotalPrecioCarrito().toFixed(2);

    y += 10;

    // Establecemos el tamaño mas grande para el precio
    doc.setFontSize(24)

    // Escribimos el precio total
    doc.text(`Total: ${precioTotal}`, 40, y);
    
    // Creamos el formato de nombre del ticket -> pedido - nombre - fecha
    const nombreUsuario = sessionStorage.getItem("cliente-nombre");
    
    let fecha = new Date();
    let nombreTicket = `Pedido de '${nombreUsuario}' - ${fecha.toISOString()}.pdf`
    
    // Imprimimos el ticket de venta
    doc.save(nombreTicket)

    // Registrar venta 
    registrarVenta(precioTotal, idProductos, nombreUsuario)

    //2.Realizar el post al endpoint de ventas


    //3.Limpiar la variable de sesion con el nombre del cliente y dedirigir al index
}

async function registrarVenta(precioTotal, idProductos, nombreUsuario) {
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
        productos: idProductos
    }

    
    const response = await fetch("http://localhost:3002/ventas", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(data)
    })
    
    const result = await response.json();

    alert(response.ok)

    if(response.ok){

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