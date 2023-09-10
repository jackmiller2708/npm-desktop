const { BrowserWindow, ipcMain, dialog } = require("electron");
const { getHistory, addToHistory } = require("../workspace-history");
const { isWorkspaceValid } = require("../workspace");
const { Workspace } = require("../../shared/models/workspace.model");
const { basename } = require("path");
const { Either } = require("../../shared/monads/either.monad");
const { IO } = require("../../shared/monads/io.monad");

/**
 * Initialize the inter process communication listeners
 * @param {BrowserWindow} window
 */
function initIPCListeners(window) {
  ipcMain.on("load-workspace-history", () => {
    const result = getHistory();

    if (result instanceof Error) {
      return;
    }

    window.webContents.send("workspace-history-loaded", JSON.stringify(result));
  });

  ipcMain.on("open-workspace", async () => {
    const result = await dialog.showOpenDialog(window, {
      properties: ["openDirectory"],
    });

    if (!result.canceled && result.filePaths.length > 0) {
      const folderPath = result.filePaths[0];

      const input = IO(() =>
        !isWorkspaceValid(folderPath)
          ? Either.Left(new Error("Invalid Workspace!"))
          : Either.Right(addToHistory(Workspace({ path: folderPath, name: basename(folderPath), timestamp: Date.now() })))
      );

      const output = input.run().fold(
        (error) => error,
        (data) => data
      );

      if (output instanceof Error) {
        return;
      }

      window.webContents.send("workspace-history-loaded", JSON.stringify(output));
    }
  });
}

module.exports = { initIPCListeners };
