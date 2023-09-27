const { BrowserWindow, app, protocol, net } = require("electron");
const { format, pathToFileURL } = require("url");
const { initIPCListeners } = require("./modules/ipc-listener");
const { join } = require("path");

/**
 * Creates the app window.
 * @returns {BrowserWindow}
 */
function createWindow() {
  return new BrowserWindow({
    minWidth: 800,
    minHeight: 600,
    autoHideMenuBar: true,
    icon: "../assets/icons/icon.png",
    frame: false,
    webPreferences: { nodeIntegration: true, contextIsolation: false },
  });
}

/**
 * Bootstrapping app configs.
 * @param {BrowserWindow} window
 */
function bootstrap(window) {
  const servePath = app.isPackaged
    ? format({ pathname: "index.html", protocol: "file", slashes: true })
    : "http://localhost:4200";

  initIPCListeners(window);
  window.loadURL(servePath);
  
  if (!app.isPackaged) {
    window.webContents.openDevTools();
  }
}

/**
 * Initializes the app.
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
