const {BrowserWindow} = require('electron')
const url = require('url')
const path = require('path')
const { app } = require('electron');


const ventanaEditarUnProducto = (productoEncontrado)=>{
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

    ventanaEditar.loadURL(url.format({
        pathname: path.join(app.getAppPath(), 'ventanasHtml/editarProd.html'),
        protocol: 'file',
        slashes: true
    }))
    ventanaEditar.webContents.on('did-finish-load', () => {
        // Después de que la ventana ha terminado de cargar, obtén el producto y envía el evento al proceso de renderizado
        ventanaEditar.webContents.send('producto-obtenido', JSON.stringify(productoEncontrado));
    });
    return ventanaEditar
}

module.exports = {ventanaEditarUnProducto}