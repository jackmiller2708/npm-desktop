const { getHistory, addToHistory, setLastOpened } = require("../workspace-history");
const { ipcMain, dialog, BrowserWindow } = require("electron")
const { validatePathThenUpdateHistory: validatePathThenAct } = require("./_service");
const { Workspace } = require("../../shared/models/workspace.model");
const { basename } = require("path");

/**
 * Initialize the inter process communication listeners
 * @param {BrowserWindow} window
 */
function initIPCListeners(window) {
  ipcMain.on("load-workspace-history", () => {
    getHistory().fold(_emitError, (data) => _emitEvent("workspace-history-loaded", data));
  });

  ipcMain.on("open-workspace", async (_, workspace) => {
    if (workspace) {
      return void setLastOpened(Workspace(workspace)).fold(_emitError, (data) =>
        _emitEvent("workspace-history-loaded", data)
      );
    }

    (await _openWorkspaceSelectDialog())?.fold(_emitError, (data) =>
      _emitEvent("workspace-history-loaded", data)
    );
  });

  // ============================================================================================
  // ============================================================================================
  // ============================================================================================
  async function _openWorkspaceSelectDialog() {
    const result = await dialog.showOpenDialog(window, { properties: ["openDirectory"] });
    
    if (!result.canceled && result.filePaths.length > 0) {
      const workspacePath = result.filePaths[0];
      const action = () => addToHistory(Workspace({ path: workspacePath, name: basename(workspacePath), timestamp: Date.now() }));

      return validatePathThenAct(workspacePath, action);
    }
  }

  function _emitError(error) {
    _emitEvent('system-error', { code: error.code ?? 500, message: error.message, type: 'error' });
  }

  function _emitEvent(eventName, data) {
    window.webContents.send(eventName, JSON.stringify(data));
  }
}

module.exports = { initIPCListeners };
