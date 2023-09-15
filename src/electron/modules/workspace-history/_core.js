const { readFile, writeFile, getResourcePath } = require("../file-system");
const { _parseData, _rawToDataMapper } = require("./_helper");
const { WorkspaceHistory } = require("../../shared/models/workspace-history.model");
const { existsSync } = require("fs");
const { Either } = require("../../shared/monads/either.monad");
const { join } = require("path");

const HISTORY_FILE = "workspace.history.json";

function _getDestinationFilePath() {
  return join(getResourcePath(), HISTORY_FILE);
}

function _processRawData(output) {
  return Either.Right(
    output.chain(_parseData).fold(
      () => WorkspaceHistory(),
      (data) => data
    )
  ).chain(_rawToDataMapper);
}

function _loadData() {
  const filePath = _getDestinationFilePath();

  return existsSync(filePath)
    ? readFile(filePath).map(_processRawData)
    : writeFile(filePath, WorkspaceHistory());
}

function _saveData(data) {
  return writeFile(_getDestinationFilePath(), data);
}

module.exports = { _saveData, _loadData };
