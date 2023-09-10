const { WorkspaceHistory } = require("../../shared/models/workspace-history.model");
const { Workspace } = require("../../shared/models/workspace.model");
const { Either } = require("../../shared/monads/either.monad");

function _parseData(json) {
  try {
    return Either.Right(JSON.parse(json));
  } catch (error) {
    return Either.Left(error);
  }
}

function _rawToDataMapper({ workspaces, lastOpened }) {
  return WorkspaceHistory({
    workspaces: List(workspaces.map((workspace) => Workspace(workspace))),
    lastOpened: Workspace(lastOpened),
  });
}

module.exports = { _parseData, _rawToDataMapper };
