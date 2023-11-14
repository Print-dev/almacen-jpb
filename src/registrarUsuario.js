const {ipcRenderer} = require('electron')

const nombre = document.getElementById('nombre')
const correo = document.getElementById('correo')
const contrasena = document.getElementById('contrasena')
const registrarbtn = document.getElementById('registrarbtn')
const volverbtn = document.getElementById('volveralmenu')

registrarbtn.addEventListener('click', function(){
    const nombreval = nombre.value
    const correoval = correo.value
    const contraval = contrasena.value
    ipcRenderer.send('registrar-usuario', {nombreval, correoval, contraval})
})

volverbtn.addEventListener('click', function(){
    ipcRenderer.send('volver-al-menuEstandoenRegistro')
})

