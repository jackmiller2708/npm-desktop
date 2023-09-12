const { getHistory, addToHistory, setLastOpened, updateFromHistory, removeFromHistory } = require("../workspace-history");
const { validatePathThenAct, ipcReqParser } = require("./_service");
const { ipcMain, dialog, BrowserWindow } = require("electron")
const { Workspace } = require("../../shared/models/workspace.model");
const { basename } = require("path");

/**
 * Initialize the inter process communication listeners
 * @param {BrowserWindow} window
 */
function initIPCListeners(window) {
  const _IPC = ipcReqParser(ipcMain);

  _IPC.on("load-workspace-history", () => {
    getHistory().fold(_emitError, (data) =>
      _emitEvent("workspace-history-loaded", data)
    );
  });

  _IPC.on("open-workspace", async (workspace) => {
    const input = workspace
      ? setLastOpened(Workspace(workspace))
      : await _openWorkspaceSelectDialog();

    input?.fold(_emitError, (data) =>
      _emitEvent("workspace-history-loaded", data)
    );
  });

  _IPC.on("update-workspace", workspace => {
    updateFromHistory(Workspace(workspace))?.fold(_emitError, (data) =>
      _emitEvent("workspace-history-loaded", data)
    );
  });

  _IPC.on("remove-workspace", workspace => {
    removeFromHistory(Workspace(workspace))?.fold(_emitError, (data) =>
      _emitEvent("workspace-history-loaded", data)
    );
  })

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
