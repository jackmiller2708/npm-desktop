const { BrowserWindow, ipcMain } = require("electron");
const { getHistory } = require("../workspace-history");

/**
 * Initialize the inter process communication listeners
 * @param {BrowserWindow} window
 */
function initIPCListeners(window) {
  ipcMain.on("load-workspace-history", () => {
    window.webContents.send("workspace-history-loaded", JSON.stringify(getHistory()));
  });
}

module.exports = { initIPCListeners };