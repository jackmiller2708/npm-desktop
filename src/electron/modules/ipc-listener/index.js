const { getHistory, addToHistory, setLastOpened } = require("../workspace-history");
const { ipcMain, dialog, BrowserWindow } = require("electron")
const { validatePathThenUpdateHistory } = require("./_service");
const { Workspace } = require("../../shared/models/workspace.model");
const { basename } = require("path");

/**
 * Initialize the inter process communication listeners
 * @param {BrowserWindow} window
 */
function initIPCListeners(window) {
  ipcMain.on("load-workspace-history", () => {
    getHistory().fold(
      (error) => error,
      (output) => window.webContents.send("workspace-history-loaded", JSON.stringify(output))
    );
  });

  ipcMain.on("open-workspace", async () => {
    const result = await dialog.showOpenDialog(window, { properties: ["openDirectory"] });
    
    if (!result.canceled && result.filePaths.length > 0) {
      const workspacePath = result.filePaths[0];
      const updateFn = () => addToHistory(Workspace({ path: workspacePath, name: basename(workspacePath), timestamp: Date.now() }));

      validatePathThenUpdateHistory(workspacePath, updateFn).fold(
        (error) => error,
        (data) => window.webContents.send("workspace-history-loaded", JSON.stringify(data))
      );
    }
  });

  ipcMain.on("load-workspace", (_, workspace) => {
    setLastOpened(Workspace(workspace)).fold(
      (error) => error,
      (data) => window.webContents.send("workspace-history-loaded", JSON.stringify(data))
    );
  });
}

module.exports = { initIPCListeners };
