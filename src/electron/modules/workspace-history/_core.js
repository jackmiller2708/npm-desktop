const { writeFileSync, existsSync } = require("fs");
const { WorkspaceHistory } = require("../../shared/workspace-history.model");
const { Workspace } = require("../../shared/workspace.model");
const { List } = require("immutable");
const { join } = require("path");

const HISTORY_FILE = "workspace.history.json";

/**
 * 
 * @returns 
 */
function _getDestinationFilePath() {
  return join(__dirname, HISTORY_FILE);
}

/**
 * 
 * @param {*} data 
 * @param {*} path 
 * @returns 
 */
function _saveData(data, path = _getDestinationFilePath()) {
  try {
    writeFileSync(path, JSON.stringify(data));
  } catch (err) {
    console.error("Error while saving recent workspaces:", err);
  }

  return data;
}

/**
 * 
 * @returns 
 */
function _loadData() {
  const filePath = _getDestinationFilePath();

  try {
    if (existsSync(filePath)) {
      const jsonData = readFileSync(filePath, "utf-8");
      const { workspaces, lastOpened } = JSON.parse(jsonData);

      return WorkspaceHistory({
        workspaces: List(workspaces.map((workspace) => Workspace(workspace))),
        lastOpened: Workspace(lastOpened),
      });
    }

    return _saveData(WorkspaceHistory());
  } catch (err) {
    console.error("Error while loading recent workspaces:", err);
  }
}

module.exports = { _saveData, _loadData };
