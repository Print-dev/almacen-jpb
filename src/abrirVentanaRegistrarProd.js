const {ipcRenderer} = require('electron')

const correo = document.getElementById('correoInput')
const contrasena = document.getElementById('contrasenaInput')
const ingresarBtn = document.getElementById('ingresarBtn')
const volverBtn = document.getElementById('volveralmenu')
const olvidoContrasenaBtn = document.getElementById('btnOlvidoContrasena')


ipcRenderer.send('testUsuario')

ingresarBtn.addEventListener('click', function(){
    const correoval = correo.value
    const contraval = contrasena.value
    ipcRenderer.send('ventana-iniciar-sesion', {correoval, contraval})
    console.log("first")
    console.log(correoval)
    console.log(contraval)
})

olvidoContrasenaBtn.addEventListener('click', function(){
    ipcRenderer.send('abrir-ventana-reset-pwd')
})

volverBtn.addEventListener('click', function(){
    ipcRenderer.send('volver-al-menuEstandoenRegistro')
})

ipcRenderer.on('usuarioIniciado', (e,args)=>{
    console.log(JSON.parse(args))
})

ipcRenderer.on('usuariosOtenidos', (e,args)=>{
    console.log(JSON.parse(args))
})