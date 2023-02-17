let carrito = [];

const contenedor = document.querySelector('#contenedor');
const carritoContenedor = document.querySelector('#carritoContenedor');
const vaciarCarrito = document.querySelector('#vaciarCarrito');
const precioTotal = document.querySelector('#precioTotal');
const procesarCompra = document.querySelector('#procesarCompra');
const activarFuncion = document.querySelector('#activarFuncion');
const totalProceso = document.querySelector('#totalProceso');
const formulario = document.querySelector('#procesar-pago')

if(activarFuncion) {
    activarFuncion.addEventListener('click', procesarPedido);
}

if(procesarCompra){
    procesarCompra.addEventListener('click', () => {
        if(carrito.length === 0) {
            alert('El carrito esta vacio')
        } else {
            location.href = "compra.html"
            procesarPedido()
        }
    })
}

if(formulario){
    formulario.addEventListener('submit', enviarCompra)
}
document.addEventListener('DOMContentLoaded', () => {
    carrito = JSON.parse(localStorage.getItem('carrito'))  || [];
    mostrarCarrito();
    if(activarFuncion){
        document.querySelector('#activarFuncion').click(procesarPedido)
    }
})

const pintarProductos = (stockProductos, contenedor) => {
    
    stockProductos.forEach((prod) => {
        const {id, nombre, precio, desc, categoria, img, cantidad} = prod
        if(contenedor) {
            contenedor.innerHTML += `
                <div class="card" style="width: 18rem;">
                    <img class="card-img-top mt-2" src="${img}" class="card-img-top" alt="Imagen del ${nombre}">
                    <div class="card-body">
                        <h5 class="card-title">${nombre}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">${categoria}</h6>
                        <p class="card-text">${desc}</p>
                        <p class="card-text">$${precio}</p>
                        <buttton onclick="agregarProducto(${id})" class="btn btn-primary">Agregar al carrito</button>
                    </div>
                </div>
            `
        }
    })
};

function agregarProducto (id){

    const existe = carrito.some(prod => prod.id === id)

    if(existe){
        const prod = carrito.map(prod => {
            if(prod.id === id){
                prod.cantidad++
            }
        })
    } else {
        const item = stockProductos.find((prod) => prod.id === id)
        carrito.push(item);
    }

    mostrarCarrito();
};

const mostrarCarrito = () => {
    const modalBody = document.querySelector('.modal .modal-body');
    if (modalBody) {
        modalBody.innerHTML = '';
        carrito.forEach((prod) => {
            const {id, nombre, precio, desc, categoria, img, cantidad} = prod;
            modalBody.innerHTML += `
                <div class="modal-contenedor">
                    <div>
                        <img class="img-fluid img-carrito" src="${img}"/>
                    </div>

                    <div>
                        <p>Producto: ${nombre}</p>
                        <p>Precio: ${precio}</p>
                        <p>Cantidad: ${cantidad}</p>

                        <button onclick="eliminarProducto(${id})" class="btn btn-danger">Eliminar producto</button>
                    </div>
                </div>
            `
            
        });
    }

    if(carrito.length === 0){
        modalBody.innerHTML = `
        <div>
            <p class="text-center parrafo">El carrito esta vacio</p>
        </div>
        ` 
    }

    carritoContenedor.textContent = carrito.length
    if(precioTotal){
        precioTotal.innerText = carrito.reduce((acc, prod) => acc + prod.cantidad * prod.precio, 0)
    }

    guardarStorage();
}

function eliminarProducto (id) {
    const itemId = id;
    carrito = carrito.filter ((item) => item.id !== itemId);
    mostrarCarrito();
}

if(vaciarCarrito){
    vaciarCarrito.addEventListener('click', () => {
        carrito.length = [];
        mostrarCarrito();
    })
}
function guardarStorage(){
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

function procesarPedido() {

    carrito.forEach((prod)=> {
        const listaCompra = document.querySelector('#lista-compra tbody');
        const {id, nombre, precio, cantidad, img} = prod;
        
        const row = document.createElement('tr');
        row.innerHTML += `
        <td>
            <img class ="img-fluid img-carrito" src="${img}" />
        </td>
        <td>${nombre}</td>
        <td>${precio}</td>
        <td>${cantidad}</td>
        <td>${precio * cantidad}</td>
        `

        listaCompra.appendChild(row);
    });
    totalProceso.innerText = '$' + carrito.reduce((acc, prod) => acc + prod.cantidad * prod.precio, 0)
}

function enviarCompra(e){
    e.preventDefault()
    const cliente = document.querySelector('#cliente').value
    const correo = document.querySelector('#correo').value

    if (cliente === '' || correo === ''){
        // Obtener el modal
        const errorModal = document.querySelector("#error-modal");
        errorModal.innerHTML = `
            <div class="error-modal-content">
                <span class="error-close">&times;</span>
                <p class="text-center mt-auto">Ha habido un error, rellena todos los datos</p>
            </div>
        `
        const span = document.querySelector('.error-close')
        errorModal.style.display = "block";
        
        span.onclick = function() {
            errorModal.style.display = "none";
        }

        // Cuando el usuario hace clic fuera del modal, se cierra
        window.onclick = function(event) {
            if (event.target == errorModal) {
                errorModal.style.display = "none";
            }
        }

    } else {
        const spinner = document.querySelector('#spinner')
        spinner.classList.add('d-flex')
        spinner.classList.remove('d-none')

        setTimeout(() => {
            spinner.classList.remove('d-flex')
            spinner.classList.add('d-none')
            formulario.reset()
        }, 3000);
        console.log('spinner')

    }
}

pintarProductos(stockProductos, contenedor);