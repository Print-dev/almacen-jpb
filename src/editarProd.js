const {ipcRenderer} = require('electron')
const categoriaProducto = document.getElementById('categoriaProducto')
const descripcion = document.getElementById('descripcion')
const unidadmedida = document.getElementById('unidadmedida')
const marca = document.getElementById('marca')
const stock = document.getElementById('stock')
const entrada = document.getElementById('entrada')
const observacion = document.getElementById('observacion')
const actualizarProd = document.getElementById('registrarProd')

let unProductoObtenido = []
let id = ""




entrada.addEventListener('change', function(){
    stock.value = entrada.value
    console.log("prodandaodsdadasdasdasd")
})



console.log("probaaaaaaaaaaaaaaaaaaaxda")

ipcRenderer.on('producto-obtenido', (e,args)=>{
    const productoObtenido = JSON.parse(args)
    unProductoObtenido = productoObtenido
    console.log(unProductoObtenido)
    
    categoriaProducto.value = unProductoObtenido.categoria
    descripcion.value = unProductoObtenido.descripcion
    unidadmedida.value = unProductoObtenido.unidadDeMedida
    marca.value = unProductoObtenido.marca
    stock.value = unProductoObtenido.stockInicial
    entrada.value = unProductoObtenido.entrada
    observacion.value = unProductoObtenido.observacion
    id = unProductoObtenido._id

    actualizarProd.addEventListener('click', function(){
        const bodyActualizar = {
            categoria: categoriaProducto.value,
            descripcion: descripcion.value,
            unidadDeMedida: unidadmedida.value,
            marca: marca.value,
            stockInicial: unProductoObtenido.stockInicial ,
            stock: unProductoObtenido.stock,
            entrada: entrada.value,
            observacion: observacion.value
        }
        console.log("antes de enviar")
        ipcRenderer.send('actualizarProducto', {id: id, body: bodyActualizar})
        console.log("despues de enviar")
    })
    
})


