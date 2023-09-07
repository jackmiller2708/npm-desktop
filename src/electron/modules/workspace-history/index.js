const { _loadData, _saveData } = require("./_core");
const { isRecord } = require("immutable");

const MAXIMUM_WORKSPACES = 10;

function getHistory() {
  return _loadData();
}

// ==================================================================
// ==================================================================
// ==================================================================
/**
 *
 * @param {*} workspace
 */
function addToHistory(workspace) {
  if (!isRecord(workspace)) {
    throw `Invalid workspace`;
  }

  const workspacesUpdater = (workspaces) => {
    let _workspaces = workspaces
      .filter(({ path }) => workspace.path !== path)
      .unshift(workspace);

    if (_workspaces.size > MAXIMUM_WORKSPACES) {
      _workspaces = _workspaces.slice(0, MAXIMUM_WORKSPACES);
    }

    return _workspaces;
  };

  return _saveData(
    _loadData()
      .update("workspaces", workspacesUpdater)
      .set("lastOpened", workspace)
  );
}

function removeFromHistory(workspace) {
  if (!isRecord(workspace)) {
    throw `Invalid workspace`;
  }

  let history = _loadData();

  if (history.lastOpened?.path === workspace.path) {
    history = history.set("lastOpened", undefined);
  }

  return _saveData(
    history.update((workspaces) =>
      workspaces.filter(({ path }) => path !== workspace.path)
    )
  );
}

function updateFromHistory(workspace) {
  if (!isRecord(workspace)) {
    throw `Invalid workspace`;
  }

  let history = _loadData();
  let index = 0;

  while (index < history.workspaces.size) {
    if (history.workspaces.get(index).path === workspace.path) {
      break;
    }

    index++;
  }

  if (index === history.workspaces.size - 1) {
    throw "Workspace does not exist";
  }

  if (history.lastOpened?.path === workspace.path) {
    history = history.setIn(["lastOpened", "name"], workspace.name);
  }

  return _saveData(
    history.setIn(["workspaces", index, "name"], workspace.name)
  );
}

// ==================================================================
// ==================================================================
// ==================================================================
function setLastOpenedWorkspace(workspace, history = _loadData()) {
  if (!workspace) {
    return _saveData(history.set("lastOpened", undefined));
  }

  if (!isRecord(workspace)) {
    throw `Invalid workspace`;
  }

  let index = 0;

  while (index < history.workspaces.size) {
    if (history.workspaces.get(index).path === workspace.path) {
      break;
    }

    index++;
  }

  if (index === history.workspaces.size) {
    throw "Workspace does not exist";
  }

  return _saveData(history.set("lastOpened", history.workspaces.get(index)));
}

module.exports = { getHistory, addToHistory, removeFromHistory, updateFromHistory };
