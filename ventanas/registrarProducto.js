const { BrowserWindow } = require('electron')
const path = require('path')
const { app } = require('electron');

const registrarProductoWin = () =>{
    const widget = new BrowserWindow({
        width: 800,
        height: 650,
        minWidth: 400,
        icon: path.join(app.getAppPath(), 'logo.ico'),
        minHeight: 400,
        webPreferences:{
            nodeIntegration: true,
            contextIsolation: false
        }
      })

    widget.loadFile('index.html')   
}

module.exports = {registrarProductoWin}