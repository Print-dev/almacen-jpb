const {ipcRenderer} = require('electron')
const XLSX = require('xlsx')

const contenedor = document.querySelector('.contenedor-general')
const busqueda = document.getElementById('busqueda')
const btnReporte = document.getElementById('btnReporte')
const recargarBtn = document.getElementById('btnRecargar')



function renderProductos(productos) {
    btnReporte.disabled = false
    contenedor.innerHTML = '';
    productos.forEach(e => {
        contenedor.innerHTML += 
        `<div class="contenedor-cartas">
            <div class="carta">                
                <div>
                    <span><b>Codigo: ${e.codigo}</b></span>
                    <h1>Categoria: ${e.categoria}</h1>                    
                    <h4><b>Descripcion: </b>${e.descripcion}</h4>
                    <h4><b>Unidad De Medida: </b>${e.unidadDeMedida}</h4>
                    <h4>Marca: ${e.marca}</h4>
                    <h4>Cantidad Total: ${e.stockTotal}</h4>  
                    <span><b>Fecha: ${e.fecha}</b></span>
                    <h4><b>Costo Total: S/${e.costoTotal}</b></h4>
                    <h4 id="observacion">Observacion: ${e.observacion}</h4>
                </div>                              
                <div class="botones-op">
                    <button class="editarBtn" data-id="${e._id}">Modificar</button>
                    <Button class="btnGenerarEntrada" data-id="${e._id}">Generar Entrada</button>               
                    <button class="btnGenerarSalida" data-id="${e._id}">Generar Salida</button>
                    <button class="btnEspecificacionesProducto" data-id="${e._id}">Especificaciones</button>
                </div>
            </div>        
        </div>`;
    });

    // Seleccionar todos los elementos con clase 'editarBtn' y añadir un manejador de eventos a cada uno
    const btnsGenerarEntrada = document.querySelectorAll('.btnGenerarEntrada');
    btnsGenerarEntrada.forEach(btn => {
        btn.addEventListener('click', function() { 
            console.log("clic")
            const id = this.getAttribute('data-id');
            /*
            const confirmacion = confirm('¿estas seguro de eliminar este producto?')
            if(confirmacion){
                ipcRenderer.send('eliminar-producto', id)
            }*/
            ipcRenderer.send('abrir-ventana-generar-entrada-producto', id)            
        });
    });

    const btnsGenerarSalida = document.querySelectorAll('.btnGenerarSalida');
    btnsGenerarSalida.forEach(btn => {
        btn.addEventListener('click', function() { 
            console.log("clic")
            const id = this.getAttribute('data-id');
            /*
            const confirmacion = confirm('¿estas seguro de eliminar este producto?')
            if(confirmacion){
                ipcRenderer.send('eliminar-producto', id)
            }*/
            ipcRenderer.send('abrir-ventana-generar-salida-producto', id)            
        });
    });

    const editarBtns = document.querySelectorAll('.editarBtn')
    editarBtns.forEach(btn => {
        btn.addEventListener('click', function(){
            const id = this.getAttribute('data-id')
            ipcRenderer.send('obtener-un-producto', id)
        })
    })

    const btnEspecificaciones = document.querySelectorAll('.btnEspecificacionesProducto')
    btnEspecificaciones.forEach(btn => {
        btn.addEventListener('click', function(){
            console.log("haciendo clic")
            const id = this.getAttribute('data-id')
            ipcRenderer.send('obtener-especificaciones', id)
        })
    })
}

function renderNoresultados(vacio){
    contenedor.innerHTML = ''
    const errorText = document.getElementById('error')
    errorText.textContent = vacio
}


let productosList = []
let vacio = ""


ipcRenderer.on('obtenerProductos', (e,args)=>{
    const productos = JSON.parse(args);
    console.log("productos", productos)
    if(productos.length !== 0){
        productosList = productos
        renderProductos(productosList);
        btnReporte.addEventListener('click', function(){
            ipcRenderer.send('generar-excel', productosList)
        })
    }
    else{
        vacio = "No se encontraron productos 🕵️‍♂️"
        renderNoresultados(vacio)
        btnReporte.disabled = true
    }
    
});

/*ipcRenderer.on('producto-eliminado-satisfactorio', (e,args)=>{
    const productoEliminado = JSON.parse(args)
    const newListProducts = productosList.filter(p => {
        return p._id !== productoEliminado._id
    })
    productosList = newListProducts
    renderProductos(productosList)
})*/

busqueda.addEventListener('input', function(){
    const textoBusqueda = busqueda.value.trim();
    ipcRenderer.send('buscar-productos', textoBusqueda);
})

ipcRenderer.on('resultados-busqueda', (event, args) => {
    const productos = JSON.parse(args);
    if(productos.length !== 0){
        productosList = productos
        renderProductos(productosList);
    }
    else{
        vacio = "No se encontraron productos 🕵️‍♂️"
        renderNoresultados(vacio)
        btnReporte.disabled = true
    }
});

ipcRenderer.on('nuevoProductoRegistrado', (e, args)=>{
    const prodActualizado = JSON.parse(args)
    productosList.push(prodActualizado)
    renderProductos(productosList)
})

recargarBtn.addEventListener('click', function(){
    ipcRenderer.send('volverObtenerProductos')
})

ipcRenderer.on('productosObtenidosOtravez', (e, args)=>{
    const productos = JSON.parse(args);
    console.log("productos", productos)
    
    
    if(productos.length !== 0){
        productosList = productos
        renderProductos(productosList);
    }
    else{
        vacio = "No se encontraron productos 🕵️‍♂️"
        renderNoresultados(vacio)
        btnReporte.disabled = true
    }
})

