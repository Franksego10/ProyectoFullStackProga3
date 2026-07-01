let listaCarrito = []
let cantidadStockCarrito = 0;
cargarCarrito()

function guardarCarrito(){
    localStorage.setItem("carrito", JSON.stringify(listaCarrito))
}
function cargarCarrito(){
    const carritoLocalStorage = localStorage.getItem("carrito");
    if(carritoLocalStorage){
        listaCarrito = JSON.parse(carritoLocalStorage);
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

    let carritoProdHTML = `
    <div class='contenedor-botones-carrito'>
        <h2 class="titulo-contenedor-productos">Productos en el carrito</h2>
        <button class='boton-vaciar' onclick='vaciarCarrito()'>Vaciar carrito</button>
        <button class='boton-comprar' onclick='realizarCompra()'>Comprar</button>
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