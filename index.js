const path = require('path')
const url = require('url')
const { BrowserWindow, app } = require('electron')
const { Client } = require('pg')

require('electron-reload')(__dirname)

let win

/**
 * Creates a new window for loading the application.
 */
function createWindow() {
  win = new BrowserWindow({
    x: 0,
    y: 0,
    width: 1140,
    height: 700,
  })

  win.loadURL('http://localhost:9999')
  win.webContents.openDevTools()

  win.on('closed', () => {
    win = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})
