const { BrowserWindow, Menu} = require('electron')
const url = require('url')
const path = require('path')
const { app } = require('electron');


const inicio = (producto)=>{
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
    principal.setMenu(null)
    principal.loadURL(url.format({
        pathname: path.join(app.getAppPath(), 'ventanasHtml/listadoDeProductos.html'),
        protocol: 'file',
        slashes: true
    }))
    principal.webContents.on('did-finish-load', () => {
        // Después de que la ventana ha terminado de cargar, obtén el producto y envía el evento al proceso de renderizado
        principal.webContents.send('obtenerProductos', JSON.stringify(producto));
    });
    
}



module.exports = {inicio}