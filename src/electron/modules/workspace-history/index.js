const { _loadData, _saveData } = require("./_core");
const { isRecord } = require("immutable");
const { Either } = require("../../shared/monads/either.monad");

const MAXIMUM_WORKSPACES = 10;

function _isValidWorkspace(workspace) {
  if (isRecord(workspace)) {
    return Either.Right(workspace)
  }

  return Either.Left(new Error('Invalid workspace'));
}

function _addToHistory(workspace) {
  const workspacesUpdater = workspaces => {
    let _workspaces = workspaces.filter(({ path }) => workspace.path !== path).unshift(workspace);

    if (_workspaces.size > MAXIMUM_WORKSPACES) {
      _workspaces = _workspaces.slice(0, MAXIMUM_WORKSPACES);
    }

    return _workspaces;
  };

  return _loadData()
    .map((history) => history.set("lastOpened", workspace).update("workspaces", workspacesUpdater))
    .chain(_saveData)
    .run();
}

function _updateFromHistory(workspace) {
  const historyUpdater = (history) => {
    let index = 0;

    while (index < history.workspaces.size) {
      if (history.workspaces.get(index).path === workspace.path) {
        break;
      }

      index += 1;
    }

    if (index === history.workspaces.size - 1) {
      Either.Left(new Error('Workspace does not exist'));
    }

    if (history.lastOpened?.path === workspace.path) {
      history = history.setIn(["lastOpened", "name"], workspace.name);
    }

    return Either.Right([index, history]);
  };

  return _loadData()
    .map(historyUpdater)
    .run()
    .fold(
      (error) => Either.Left(error),
      ([index, history]) => Either.Right(_saveData(history.setIn(["workspaces", index, "name"], workspace.name)))
    );
}

function getHistory() {
  return _loadData().run();
}

function addToHistory(workspace) {
  return _isValidWorkspace(workspace).map(_addToHistory).fold((error) => error, (data) => data);
}

function updateFromHistory(workspace) {
  return _isValidWorkspace(workspace).map(_updateFromHistory).fold((error) => error, (data) => data);
}


module.exports = { getHistory, addToHistory, updateFromHistory };
