const { readFile, writeFile } = require("../file-system");
const { WorkspaceHistory } = require("../../shared/models/workspace-history.model");
const { existsSync } = require("fs");
const { Workspace } = require("../../shared/models/workspace.model");
const { List } = require("immutable");
const { join } = require("path");
const { Either } = require("../../shared/monads/either.monad");

const HISTORY_FILE = "workspace.history.json";

function _getDestinationFilePath() {
  return join(__dirname, HISTORY_FILE);
}

function _parseData(json) {
  try {
    return Either.Right(JSON.parse(json));
  } catch (error) {
    return Either.Left(error);
  }
}

function _rawToDataMapper({ workspaces, lastOpened }) {
  return  WorkspaceHistory({ 
    workspaces: List(workspaces.map((workspace) => Workspace(workspace))), 
    lastOpened: Workspace(lastOpened) 
  })
}

function _loadData() {
  const filePath = _getDestinationFilePath();

  return existsSync(filePath)
    ? readFile(filePath)
        .map(output => output.chain(_parseData).fold(() => _saveData(WorkspaceHistory()).run(), (data) => data))
        .map(_rawToDataMapper)
    : writeFile(filePath, WorkspaceHistory())
        .map((result) => result.fold((error) => error, (data) => data));
}

function _saveData(data) {
  return writeFile(_getDestinationFilePath(), data).map((result) =>
    result.fold((error) => error, (content) => content)
  );
}

module.exports = { _saveData, _loadData };
