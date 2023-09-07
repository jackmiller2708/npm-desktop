const { BrowserWindow, ipcMain } = require("electron");
const { getHistory } = require("../workspace-history");

/**
 * Initialize the inter process communication listeners
 * @param {BrowserWindow} window
 */
function initIPCListeners(window) {}

module.exports = { initIPCListeners };
