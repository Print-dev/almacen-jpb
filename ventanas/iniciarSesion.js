const {BrowserWindow} = require('electron')
const url = require('url')
const path = require('path')
const {app}= require('electron')

const ventanaInicioSesion = ()=>{
    const ventanaEditar = new BrowserWindow({
        width: 800,
        height: 600,
        minWidth: 400,
        minHeight: 400,
        icon: path.join(app.getAppPath(), 'logo.ico'),
        webPreferences:{
            nodeIntegration: true,
            contextIsolation: false
        }
    })
    //ventanaEditar.setMenu(null)
    ventanaEditar.loadURL(url.format({
        pathname: path.join(app.getAppPath(), 'ventanasHtml/iniciarSesion.html'),
        protocol: 'file',
        slashes: true
    }))
}

module.exports = {ventanaInicioSesion}