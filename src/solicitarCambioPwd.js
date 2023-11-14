const {ipcRenderer} = require('electron')
const solicitudBtn = document.getElementById('btnSolicitud')
const correo = document.getElementById('correo')
const verificarBtn = document.getElementById('btnVerificar')
const codigo = document.getElementById('codigo')
const newPwd = document.getElementById('newContrasena')
const confirmarBtn = document.getElementById('btnConfirmar')
const regresarBtn = document.getElementById('btnRegresar')


codigo.setAttribute("type", "hidden")
newPwd.setAttribute("type", "hidden")
regresarBtn.style.visibility= 'hidden'
verificarBtn.style.visibility= 'hidden'
confirmarBtn.style.visibility= 'hidden'

solicitudBtn.addEventListener('click', function(){
    ipcRenderer.send('enviar-solicitud-reset-pwd', {correo: correo.value})    
})

ipcRenderer.on('recibirCodigo', (e,args)=>{
    codigo.setAttribute("type", "text")
    verificarBtn.style.visibility= 'visible'
    verificarBtn.addEventListener('click', function(){
        ipcRenderer.send('verificarToken', {token: args, cod: codigo.value})
    })
})

ipcRenderer.on('solicitarNuevaContrasena', (e,args)=>{
    newPwd.setAttribute("type", "text")
    confirmarBtn.style.visibility= 'visible'
    confirmarBtn.addEventListener('click', function(){
        ipcRenderer.send('cambiarContrasena', {token: JSON.parse(args), newPass: newPwd.value})
    })
    
})

ipcRenderer.on('contrasenaCambiada', (e,args)=>{
    solicitudBtn.disabled = true
    correo.disabled = true
    verificarBtn.disabled = true
    codigo.disabled = true
    confirmarBtn.disabled = true
    newPwd.disabled = true
    regresarBtn.style.visibility= 'visible'  
    solicitudBtn.style.visibility= 'hidden' 
    verificarBtn.style.visibility= 'hidden'
    confirmarBtn.style.visibility= 'hidden'
    regresarBtn.addEventListener('click', function(){
        ipcRenderer.send('regresarPrincipal')
    })
})