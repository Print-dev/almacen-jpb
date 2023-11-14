const {ipcRenderer} = require('electron')

const contenedor = document.querySelector('.contenedor-general')
const fechaBusqueda = document.getElementById('fecha-busqueda')
const vertodoBtn = document.getElementById('verTodo')
const reporteBtn = document.getElementById('btnReporte')


function renderEspecificaciones(productosActualizadosList){
    reporteBtn.disabled = false
    contenedor.innerHTML = '';
    productosActualizadosList.forEach(e => {
        contenedor.innerHTML += 
        `<div class="contenedor-cartas">
            <div class="carta">                
                <div>
                    <span>Modificado por: <b>${e.registradoPor?.nombre}</b></span> 
                    <h2>Cantidad Total: ${e.stockTotal}</h2>
                    <h3>Ingresos: ${e.cantidad_ingresada}</h3>  
                    <h3>Salidas: ${e.cantidad_retirada}</h3> 
                    <h3>Costo por unidad: ${e.costoUnidad}</h3> 
                    <h3>Costo Total: ${e.costoTotal}</h3> 
                    <h3>Observacion: ${e.observacion}</h3> 
                    <span>Fecha De Actualizacion: <b>${e.fechaActualizacion}</b></span> </br>
                    <span>Hora De Actualizacion: <b>${e.horaActualizacion}</b></span> 
                </div>                                             
            </div>        
        </div>`;
    });
}

function renderNoresultados(vacio){
    contenedor.innerHTML = ''
    const errorText = document.getElementById('error')
    errorText.textContent = vacio
}

let productoCheck = []
let cantidadProd = []
let productosActualizadosList = []
let vacio = ""
let codigo = ""

function formatDate(inputDate) {
    const date = new Date(inputDate);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const dayInt = date.getDate() + 1
    const day = dayInt.toString()
    return `${day}/${month}/${year}`;
}

fechaBusqueda.addEventListener('change', function(){
    renderNoresultados('');
    const fechaSeleccionada = formatDate(fechaBusqueda.value)
    console.log(fechaSeleccionada)
    console.log(codigo)
    ipcRenderer.send('obtener-especificaciones-por-fecha', fechaSeleccionada, codigo);
})

vertodoBtn.addEventListener('click', function(){
    console.log("clcicc")
    location.reload()
})



ipcRenderer.on('productosActualizadosEncontrados', (e,args)=>{
    const productos = JSON.parse(args);
    console.log(productos)
    productosActualizadosList = productos
    codigo = productosActualizadosList[0].codigo    
    renderEspecificaciones(productosActualizadosList);
   
})

ipcRenderer.on('productosActualizadosEncontradosPorFecha', (e, args) => {
    const productos = JSON.parse(args);
    console.log("productos actualizados: ",productos);
    // Renderiza las especificaciones con la lista de productos actualizados
    if(productos.length !== 0){
        productosActualizadosList = productos
        renderEspecificaciones(productos);        
    }
    else{
        vacio = "No se encontraron resultados 🕵️‍♂️"
        renderNoresultados(vacio)
        reporteBtn.disabled = true
    }
  
});

reporteBtn.addEventListener('click', function(){
   ipcRenderer.send('generar-excel-productos-alterados', productosActualizadosList)
})