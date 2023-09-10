const { getHistory, addToHistory, setLastOpened } = require("../workspace-history");
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
    const updateFn = () => addToHistory(Workspace({ path, name: basename(path), timestamp: Date.now() }));
    const result = await dialog.showOpenDialog(window, { properties: ["openDirectory"] });

    if (!result.canceled && result.filePaths.length > 0) {
      validatePathThenUpdateHistory(result.filePaths[0], updateFn).fold(
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
