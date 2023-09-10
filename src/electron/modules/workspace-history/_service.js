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

function _addToHistory(workspace, history) {
  return Either.Right(
    history.set("lastOpened", workspace).update("workspaces", (workspaces) => {
      let _workspaces = workspaces.filter(({ path }) => workspace.path !== path).unshift(workspace);

      if (_workspaces.size > MAXIMUM_WORKSPACES) {
        _workspaces = _workspaces.slice(0, MAXIMUM_WORKSPACES);
      }

      return _workspaces;
    })
  );
}

function _updateFromHistory(workspace, history) {
  let index = 0;

  while (index < history.workspaces.size) {
    if (history.workspaces.get(index).path === workspace.path) {
      break;
    }

    index++;
  }

  if (index === history.workspaces.size - 1) {
    return Either.Left(new Error('Workspace does not exist'));
  }

  if (history.lastOpened?.path === workspace.path) {
    history = history.setIn(['lastOpened', 'name'], workspace.name);
  }

  return Either.Right(history.setIn(['workspaces', index, 'name'], workspace.name));
}

function _setLastOpened(workspace, history) {
  let index = 0;

  while (index < history.workspaces.size) {
    if (history.workspaces.get(index).path === workspace.path) {
      break;
    }

    index++;
  }

  if (index === history.workspaces.size - 1) {
    return Either.Left(new Error('Workspace does not exist'));
  }

  return Either.Right(history.set('lastOpened', history.workspaces.get(index)));
}

function _unsetLastOpened(history) {
  return Either.Right(history.set('lastOpened', undefined));
}

function _updateAndPersistHistory(updaterFn) {
  return _loadData()
    .map(output => output.chain(updaterFn).chain(updatedData => _saveData(updatedData).run()))
    .run();
}

module.exports = { _isValidWorkspace, _updateAndPersistHistory, _addToHistory, _updateFromHistory, _setLastOpened, _unsetLastOpened };