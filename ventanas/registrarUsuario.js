const { BrowserWindow, Menu} = require('electron')
const url = require('url')
const path = require('path')
const { app } = require('electron');


const ventanaregistrarUsuario = ()=>{
    const principal = new BrowserWindow({
        width: 800,
        height: 650,
        minWidth: 400,
        minHeight: 400,
        icon: path.join(app.getAppPath(), 'logo.ico'),
        webPreferences:{
            nodeIntegration: true,
            contextIsolation: false
            
        }
    })
  
    principal.loadURL(url.format({
        pathname: path.join(app.getAppPath(), 'ventanasHtml/registrarUsuario.html'),
        protocol: 'file',
        slashes: true
    }))
}



module.exports = {ventanaregistrarUsuario}