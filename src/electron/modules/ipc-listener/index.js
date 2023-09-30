const { getHistory, addToHistory, setLastOpened, updateFromHistory, removeFromHistory, unsetLastOpened } = require("../workspace-history");
const { validatePathThenAct, ipcReqParser } = require("./_service");
const { ipcMain, dialog, BrowserWindow } = require("electron")
const { Subject, takeUntil } = require("rxjs");
const { loadWorkspace } = require("../workspace");
const { Workspace } = require("../../shared/models/workspace.model");
const { basename } = require("path");

/**
 * Initialize the inter process communication listeners
 * @param {BrowserWindow} window
 */
function initIPCListeners(window) {
  const _workspaceClose$ = new Subject();
  const _windowControls = {
    close: () => window.close(),
    restore: () => window.restore(),
    maximize: () => window.maximize(),
    minimize: () => window.minimize(),
    fullscreen: () => window.setFullScreen(true),
    exitFullscreen: () => window.setFullScreen(false),
  };
  
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

  _IPC.on("close-workspace", () => {
    unsetLastOpened().fold(_emitError, (data) => {
      _workspaceClose$.next();
      _emitEvent("workspace-history-loaded", data);
    });
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

  _IPC.on("load-workspace", (workspace) => {
    _workspaceClose$.next();

    loadWorkspace(Workspace(workspace))
      .pipe(takeUntil(_workspaceClose$))
      .subscribe((data) => _emitEvent("workspace-loaded", data));
  });

  _IPC.on("window-control", ({ command }) => {
    if (command in _windowControls) {
      _windowControls[command]();
    }
  })

  window.on("enter-full-screen", () => {
    _emitEvent("fullscreen", { flag: true });
  });

  window.on("leave-full-screen", () => {
    _emitEvent("fullscreen", { flag: false });
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
    _emitEvent("system-error", {
      code: error.code ?? 500,
      message: error.message,
      type: "error",
    });
  }

  function _emitEvent(eventName, data) {
    window.webContents.send(
      eventName,
      typeof data !== "string" ? JSON.stringify(data) : data
    );
  }
}

module.exports = { initIPCListeners };
