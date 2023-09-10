const { _parseData, _rawToDataMapper } = require("./_helper");
const { readFile, writeFile } = require("../file-system");
const { WorkspaceHistory } = require("../../shared/models/workspace-history.model");
const { existsSync } = require("fs");
const { join } = require("path");
const { Either } = require("../../shared/monads/either.monad");

const HISTORY_FILE = "workspace.history.json";

function _getDestinationFilePath() {
  return join(__dirname, HISTORY_FILE);
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
