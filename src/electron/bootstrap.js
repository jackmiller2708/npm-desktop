const { BrowserWindow, app, protocol, net, dialog } = require("electron");
const { format, pathToFileURL } = require("url");
const { join } = require("path");

/**
 *
 * @returns {BrowserWindow}
 */
function createWindow() {
  return new BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar: true,
    webPreferences: { nodeIntegration: true, contextIsolation: false },
  });
}

/**
 *
 * @param {BrowserWindow} window
 */
function bootstrap(window) {
  const servePath = app.isPackaged
    ? format({ pathname: "index.html", protocol: "file", slashes: true })
    : "http://localhost:4200";

  window.loadURL(servePath);
  window.webContents.openDevTools();
}

/**
 * 
 */
function initApp() {
  protocol.handle("file", (req) => {
    const filePath = pathToFileURL(
      join(process.resourcesPath, "ui", req.url.slice("file://".length))
    ).toString();

    return net.fetch(filePath, { bypassCustomProtocolHandlers: true });
  });

  bootstrap(createWindow());
}

module.exports = { initApp };
