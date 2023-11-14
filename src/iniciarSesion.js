const {ipcRenderer} = require('electron')

const iniciarBtn = document.getElementById('iniciarsesionbtn')

iniciarBtn.addEventListener('click', function(){ 
    ipcRenderer.send('abrir-ventana-iniciar-sesion')
})

const registrarseBtn = document.getElementById('registrarsebtn')

registrarseBtn.addEventListener('click', function(){
    ipcRenderer.send('ventana-registrar-usuario')
})

