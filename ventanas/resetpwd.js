const { BrowserWindow, Menu} = require('electron')
const url = require('url')
const path = require('path')
const { app } = require('electron');


const ventanaResetPwd = ()=>{
    const ventana = new BrowserWindow({
        width: 800,
        height: 820,
        minWidth: 400,
        minHeight: 400,
        resizable: false,
        icon: path.join(app.getAppPath(), 'logo.ico'),
        webPreferences:{
            nodeIntegration: true,
            contextIsolation: false
            
        }
    })
  
    ventana.loadURL(url.format({
        pathname: path.join(app.getAppPath(), 'ventanasHtml/resetPwd.html'),
        protocol: 'file',
        slashes: true
    }))
}



module.exports = {ventanaResetPwd}