const {ipcRenderer} = require('electron')
const contenedorProducto = document.querySelector('.contenedor-general-producto')

function renderProducto(producto){
    contenedorProducto.innerHTML = ''
    contenedorProducto.innerHTML += 
    `<div class="contenedor-cartas">
        <div class="carta">                            
            <div class="desc">                
                <h1><b>Generar Entrega</b></h1>  
                <h3><b>${producto.descripcion}</b></h3> 
                <h2>Cantidad actual: ${producto.stockTotal}</h2>
            </div>
            <div class="operacion">
            <span>Entrada</span>
                <input type="number" id="numEntrada" min="1">
                <span>Nuevo Costo</span>
                <input type="number" id="newCosto" min="1">
                <span>Observacion</span>
                <input type="text" id="newObservacion">
                <button id='btnRegistrarEntrada'>Enviar</button>              
            </div>                                                                   
        </div>        
    </div>`;

    const btnEntrada = document.getElementById('btnRegistrarEntrada')
    const numEntrada = document.getElementById('numEntrada')
    const newCosto = document.getElementById('newCosto')
    const newObservacion = document.getElementById('newObservacion')
    // HORA Y FECHA
    const fechaActual = new Date();
    const año = fechaActual.getFullYear()
    const mes = fechaActual.getMonth() + 1
    const dia = fechaActual.getDate()
    const horas = fechaActual.getHours()
    const minutos = fechaActual.getMinutes()
    const segundos = fechaActual.getSeconds()
    // ***********
    newCosto.value = producto.costoUnidad
    newObservacion.value = producto.observacion
    numEntrada.value = 1
    // *************
    btnEntrada.addEventListener('click', function(){   
        
        const costoProductoUnidad = parseFloat(newCosto.value)
        const entrada = parseFloat(numEntrada.value)
        const totalCostoEntrada = costoProductoUnidad * entrada    
        console.log("clcic")        
        const bodyActualizar = {
            fecha: producto.fecha,
            fechaActualizacion: dia + "/" + mes + "/" + año,
            horaCreacion: producto.horaCreacion,
            horaActualizacion: horas + ':' + minutos + ':' + segundos,
            codigo: producto.codigo,
            descripcion: producto.descripcion,
            unidadDeMedida: producto.unidadDeMedida,
            marca: producto.marca,
            categoria: producto.categoria,
            almacen: producto.almacen,
            stockInicial: producto.stockInicial,
            stockTotal: producto.stockTotal + parseInt(numEntrada.value),
            entrada: producto.entrada + parseInt(numEntrada.value),
            salida: producto.salida,
            observacion: newObservacion.value,
            costoUnidad: newCosto.value,
            costoInicial: producto.costoInicial,
            costoTotal: producto.costoTotal + totalCostoEntrada,
            registradoPor: producto.registradoPor
        }
        ipcRenderer.send('generarEntrada', {id: producto._id, body: bodyActualizar, numEnt: parseInt(numEntrada.value)})
    })
}


let productoCheck = []
let cantidadProd = []

console.log("aaadsadadasdasdsdsad")

ipcRenderer.on('productoEncontrado', (e,args)=>{
    console.log("probbbb")
    console.log(JSON.parse(args))
    const producto = JSON.parse(args)
    productoCheck = producto[0]
    console.log("producto xd: ", productoCheck)
    renderProducto(productoCheck)
})

ipcRenderer.on('productoActualizado', (e,args)=>{
    const prodActualizado = JSON.parse(args)
    const prodConCantidadActualizada = prodActualizado
    cantidadProd = prodConCantidadActualizada
    renderProducto(cantidadProd)
})
