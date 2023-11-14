const {BrowserWindow} = require('electron')
const url = require('url')
const path = require('path')
const { app } = require('electron');


const ventanaGenerarEntrada = (producto)=>{
    const ventana = new BrowserWindow({
        width: 500,
        height: 470,
        minWidth: 400,
        minHeight: 400,
        icon: path.join(app.getAppPath(), 'logo.ico'),
        resizable: false,
        webPreferences:{
            nodeIntegration: true,
            contextIsolation: false
            
        }
    })
    ventana.setMenu(null)
    ventana.loadURL(url.format({
        pathname: path.join(app.getAppPath(), 'ventanasHtml/generarEntrada.html'),
        protocol: 'file',
        slashes: true
    }))
    ventana.webContents.on('did-finish-load', () => {
        // Después de que la ventana ha terminado de cargar, obtén el producto y envía el evento al proceso de renderizado
        ventana.webContents.send('productoEncontrado', JSON.stringify(producto));
    });
    return ventana
    
}

module.exports = {ventanaGenerarEntrada}