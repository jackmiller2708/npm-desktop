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
  const _IPC = _ipcReqParser(ipcMain);

  _IPC.on("load-workspace-history", () => {
    getHistory().fold(_emitError, (data) => _emitEvent("workspace-history-loaded", data));
  });

  _IPC.on("open-workspace", async (workspace) => {
    const input = workspace
      ? setLastOpened(Workspace(workspace))
      : await _openWorkspaceSelectDialog();

    return void input?.fold(_emitError, (data) =>
      _emitEvent("workspace-history-loaded", data)
    );
  });

  // ============================================================================================
  // ============================================================================================
  // ============================================================================================
  function _ipcReqParser (ipc) {
    return {
      on: (eventName, fn) =>
        ipc.on(eventName, (_, data) => fn(data ? JSON.parse(data) : data)),
    };
  }

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
