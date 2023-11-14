const {ipcRenderer} = require('electron')
const contenedorProducto = document.querySelector('.contenedor-general-producto')

function renderProducto(producto){
    contenedorProducto.innerHTML = ''
    contenedorProducto.innerHTML += 
    `<div class="contenedor-cartas">
        <div class="carta">                            
            <div class="desc">    
                <h1><b>Generar Salida</b></h1>                
                <h3><b>${producto.descripcion}</b></h3> 
                <h2>Cantidad actual: ${producto.stockTotal}</h2>
            </div>
            <div class="operacion">
                <span>Entrada</span>
                <input type="number" id="numEntrada" min="1">                
                <span>Observacion</span>
                <input type="text" id="newObservacion">
                <button id='btnRegistrarEntrada'>Enviar</button>                
            </div>                                                                   
        </div>        
    </div>`;

    const btnEntrada = document.getElementById('btnRegistrarEntrada')
    const numEntrada = document.getElementById('numEntrada')
    const newObservacion = document.getElementById('newObservacion')
    // HORA Y FECHA
    const fechaActual = new Date();
    const año = fechaActual.getFullYear()
    const mes = fechaActual.getMonth() + 1
    const dia = fechaActual.getDate()
    const horas = fechaActual.getHours()
    const minutos = fechaActual.getMinutes()
    const segundos = fechaActual.getSeconds()
    newObservacion.value = producto.observacion
    numEntrada.value = 1
    //newCosto.value = producto.costoUnidad
    // ***********
    btnEntrada.addEventListener('click', function(){
        console.log("clcic")        
        const salidaValue = parseInt(numEntrada.value);
        if (salidaValue > producto.stockTotal) {
            // Mostrar un mensaje de error
            alert("La cantidad de salida no puede ser mayor que el stock actual.");
            return; // Salir de la función si la cantidad de salida es mayor que el stockTotal
        }
        if (salidaValue < 0) {
            // Mostrar un mensaje de error o realizar alguna acción adecuada
            alert("Número de salida no válido.");
            return; // Salir de la función si el número de entrada no es válido
        }
        //<span>Nuevo Costo</span>
        //<input type="number" id="newCosto" min="1" disabled>
        //const costoProductoUnidad = parseFloat(newCosto.value)        
        //const totalCostoSalida = costoProductoUnidad * salidaValue   
        //parseFloat(producto.costoTotal) - totalCostoSalida
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
            stockTotal: producto.stockTotal - salidaValue,
            entrada: producto.entrada,
            salida: producto.salida + salidaValue,
            observacion: newObservacion.value,
            costoUnidad: producto.costoUnidad,
            costoInicial: producto.costoInicial,
            costoTotal: parseFloat(producto.costoTotal),
            registradoPor: producto.registradoPor
        }
        ipcRenderer.send('generarSalida', {id: producto._id, body: bodyActualizar, numSal: salidaValue})
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

ipcRenderer.on('productoActualizadoSalida', (e,args)=>{
    const prodActualizado = JSON.parse(args)
    const prodConCantidadActualizada = prodActualizado
    cantidadProd = prodConCantidadActualizada
    renderProducto(cantidadProd)
})
