const { BrowserWindow, Menu} = require('electron')
const {app}= require('electron')
const url = require('url')
const path = require('path')

const menu = ()=>{
    const principal = new BrowserWindow({
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
  
    principal.loadURL(url.format({
        pathname: path.join(app.getAppPath(), 'ventanasHtml/menu.html'),
        protocol: 'file',
        slashes: true
    }))
}



module.exports = {menu}