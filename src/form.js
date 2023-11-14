const categoria = document.getElementById('categoriaProducto')
const descripcion = document.getElementById('descripcion')
const unidadmedida = document.getElementById('unidadmedida')
const marca = document.getElementById('marca')
const stock = document.getElementById('stock')
const entrada = document.getElementById('entrada')
const observacion = document.getElementById('observacion')
const registrarprodBtn = document.getElementById('registrarProd')
const volverPaginaPrincipalBtn = document.getElementById('volverPaginaPrincipal')
const usuarioLogeado = document.getElementById('usuarioLogeado')
const verProductosBtn = document.getElementById('verProductos')
const costo = document.getElementById('costo')


const {ipcRenderer} = require('electron')

stock.disabled = true

registrarprodBtn.addEventListener('click',(e)=>{
    e.preventDefault()
    const entradaVal = parseInt(entrada.value)
    if (entradaVal < 0) {
   
        alert("La cantidad de entrada no debe ser menor a 0.");
        return; 
    }   

    const producto = {
        categoria: categoria.value,
        descripcion: descripcion.value,
        unidadmedida: unidadmedida.value,
        marca: marca.value,
        stockInicial: stock.value ,
        stock: stock.value,
        entrada:entradaVal ,
        costoInicial: parseFloat(costo.value),
        costoTotal: parseFloat(costo.value),
        observacion: observacion.value     
    }

    ipcRenderer.send('registroProducto', producto)
    
})

entrada.addEventListener('change', function(){
    stock.value = entrada.value
})

ipcRenderer.on('nuevoProductoRegistrado', (e,args)=>{
    const prodReg = JSON.parse(args)
    console.log(prodReg)
})

volverPaginaPrincipalBtn.addEventListener('click', function(){
    ipcRenderer.send('volver-a-menu')
})

ipcRenderer.send('obtenerUsuario')

ipcRenderer.on('obtenerUsuario', (e,args)=>{
    const usuario = JSON.parse(args)
    usuarioLogeado.textContent = "Usuario logeado: "+ usuario.nombre
})

verProductosBtn.addEventListener('click', function(){
    ipcRenderer.send('obtenerProductos')
})
