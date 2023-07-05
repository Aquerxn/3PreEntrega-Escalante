var carritoVisible = false;

if(document.readyState=='loading'){
    document.addEventListener('DOMContentLoaded', ready)
}else{
    ready()
}


function ready(){
    // FUNCIONALIDAD DE LOS BOTONES PARA ELIMINAR PRODUCTOS
    var botonEliminarProducto = document.getElementsByClassName('btn-eliminar');
    for( var i=0; i< botonEliminarProducto.length; i++){
        var button = botonEliminarProducto[i];
        button.addEventListener('click', eliminarProductoCarrito);
    }

    // FUNCIONALIDAD DE LOS BOTONES PARA SUMAR CANTIDAD
    var botonSumarCantidad = document.getElementsByClassName('sumar-cantidad');
    for( var i=0; i < botonSumarCantidad.length; i++){
        var button = botonSumarCantidad[i];
        button.addEventListener('click', sumarCantidad)
    }

    // FUNCIONALIDAD DE LOS BOTONES PARA RESTAR CANTIDAD
    var botonRestarCantidad = document.getElementsByClassName('restar-cantidad');
    for( var i=0; i < botonRestarCantidad.length; i++){
        var button = botonRestarCantidad[i];
        button.addEventListener('click', restarCantidad)
    }

    // FUNCIONALIDAD DE LOS BOTONES AGREGAR AL CARRITO
    var botonAgregarAlCarrito= document.getElementsByClassName('boton-producto');
    for(var i=0; i<botonAgregarAlCarrito.length; i++){
        var button = botonAgregarAlCarrito[i];
        button.addEventListener('click', agregarAlCarritoClicked);
    }

    // FUNCIONALIDAD DEL BOTON PAGAR
    document.getElementsByClassName('btn-pagar')[0].addEventListener('click', pagarClicked)

    // VERIFICAR SI HAY DATOS EN EL LocalStorage
    var productoData = localStorage.getItem('producto');
    if (productoData) {
        productoData = JSON.parse(productoData);
        var titulo = productoData.titulo;
        var precio = productoData.precio;
        var imagenSrc = productoData.imagenSrc;

      // Restaurar producto en el carrito
    agregarProductoAlCarrito(titulo, precio, imagenSrc);
    }
}

// FUNCION PARA ELIMINAR PRODUCTO
function eliminarProductoCarrito(event){
    var buttonClicked = event.target;
    buttonClicked.parentElement.remove();

    // ELIMINAR DATOS DEL PRODUCTO DEL localStorage
    localStorage.removeItem('producto');



    // ACTUALIZA EL CARRITO CUANDO SE ELIMINA UN PRODUCTO
    actualizarTotalCarrito();

}

// FUNCION PARA ACTUALIZAR EL TOTAL DEL CARRITO
function actualizarTotalCarrito(){
    var carritoContenedor = document.getElementsByClassName('carrito')[0];
    var carritoProductos = carritoContenedor.getElementsByClassName('carrito-producto');
    var total = 0;

    for(var i=0; i < carritoProductos.length; i++){
        var producto = carritoProductos[i];
        var precioElemento = producto.getElementsByClassName('carrito-producto-precio')[0];
        var precio = parseFloat(precioElemento.innerText.replace('$','').replace('.',''));
        var cantidadProducto = producto.getElementsByClassName('carrito-producto-cantidad')[0];
        var cantidad = cantidadProducto.value;
        total = total + (precio * cantidad);
    }
    total = Math.round(total*100)/100;
    document.getElementsByClassName('carrito-precio-total')[0].innerText = '$' + total.toLocaleString("es") + ',00';
}

// AUMENTAR EN UNO LA CANTIDAD DEL CARRITO
function sumarCantidad(event){
    var buttonClicked = event.target;
    var selector = buttonClicked.parentElement;
    var cantidadActual = selector.getElementsByClassName('carrito-producto-cantidad')[0].value;
    cantidadActual++;
    selector.getElementsByClassName('carrito-producto-cantidad')[0].value = cantidadActual;

    actualizarTotalCarrito();
}

// RESTAR EN UNO LA CANTIDAD DEL CARRITO
function restarCantidad(event){
    var buttonClicked = event.target;
    var selector = buttonClicked.parentElement;
    var cantidadActual = selector.getElementsByClassName('carrito-producto-cantidad')[0].value;
    cantidadActual--;

    if(cantidadActual>=1){
        selector.getElementsByClassName('carrito-producto-cantidad')[0].value = cantidadActual;

        actualizarTotalCarrito();
    }

}

function agregarAlCarritoClicked(event){
    var button = event.target;
    var producto = button.parentElement;
    var titulo = producto.getElementsByClassName('titulo-producto')[0].innerText;
    var precio = producto.getElementsByClassName('precio-producto')[0].innerText;
    var imagenSrc = producto.getElementsByClassName('img-producto')[0].src;

    if (!productoExisteEnCarrito(titulo)) {
        agregarProductoAlCarrito(titulo, precio, imagenSrc);
    } else {
        alert("El producto ya se encuentra en el carrito.");
    } 
}

function productoExisteEnCarrito(titulo) {
    var carritoProductos = document.getElementsByClassName('carrito-producto-titulo');
    for (var i = 0; i < carritoProductos.length; i++) {
        if (carritoProductos[i].innerText === titulo) {
        return true;
    }
    }
    return false;
}

function agregarProductoAlCarrito(titulo, precio, imagenSrc){
    var producto = document.createElement('div');
    producto.classList.add('producto');
    var productoCarrito = document.getElementsByClassName('carrito-productos')[0];

    var nombresProductosCarrito = productoCarrito.getElementsByClassName('carrito-producto-titulo');
    for(var i=0; i < nombresProductosCarrito.length; i++){
        if(nombresProductosCarrito[i].innerText==titulo){
            alert("El producto ya se encuentra en el carrito.")
        }
    }

    var precioNumerico = parseFloat(precio.replace('$', '').replace(',', ''));

    // ALAMCENAR DATOS DEL PRODUCTO EN EL LocalStorage
    var productoData = {
        titulo: titulo,
        precio: precio,
        imagenSrc: imagenSrc
    };

    localStorage.setItem('producto', JSON.stringify(productoData));

    actualizarTotalCarrito();


    var productoCarritoContenido = `
    <div class="carrito-producto">
        <img src="${imagenSrc}" alt="">
        <div class="carrito-producto-detalles">
            <span class="carrito-producto-titulo">${titulo}</span>
            <div class="selector-cantidad">
                <i class="fa-solid fa-minus restar-cantidad"></i>
                <input type="text" value="1" class="carrito-producto-cantidad" disabled>
                <i class="fa-solid fa-plus sumar-cantidad"></i>
            </div>
            <span class="carrito-producto-precio">${precio}</span>
        </div>
        <span class="btn-eliminar">
            <i class="fa-solid fa-trash"></i>
        </span>
    </div>
`;
        
    producto.innerHTML = productoCarritoContenido;
    productoCarrito.append(producto);

    // FUNCIONALIDAD DE ELIMINAR DEL NUEVO PRODUCTO
    producto.getElementsByClassName('btn-eliminar')[0].addEventListener('click',eliminarProductoCarrito);

    // FUNCIONALIDAD DE SUMAR DEL NUEVO PRODUCTO
    var botonSumarCantidad = producto.getElementsByClassName('sumar-cantidad')[0];
    botonSumarCantidad.addEventListener('click', sumarCantidad);

    // FUNCIONALIDAD DE RESTAR DEL NUEVO PRODUCTO
    var botonRestarCantidad = producto.getElementsByClassName('restar-cantidad')[0];
    botonRestarCantidad.addEventListener('click', restarCantidad);

    actualizarTotalCarrito();

}

function pagarClicked(event){
    alert("Gracias por su compra.");
    var carritoProductos = document.getElementsByClassName('carrito-productos')[0];
    while(carritoProductos.hasChildNodes()){
        carritoProductos.removeChild(carritoProductos.firstChild);
    }
    actualizarTotalCarrito();
}


