const { _updateAndPersistHistory, _setLastOpened, _unsetLastOpened, _addToHistory, _updateFromHistory, _isValidWorkspace, _removeFromHistory } = require("./_service");
const { _loadData } = require("./_core");

function getHistory() {
  return _loadData().run();
}

function setLastOpened(workspace) {
  return _isValidWorkspace(workspace).chain((result) =>
    _updateAndPersistHistory((history) => _setLastOpened(result, history))
  );
}

function unsetLastOpened() {
  return _updateAndPersistHistory((history) => _unsetLastOpened(history));
}

function addToHistory(workspace) {
  return _isValidWorkspace(workspace).chain((result) =>
    _updateAndPersistHistory((history) => _addToHistory(result, history))
  );
}

function updateFromHistory(workspace) {
  return _isValidWorkspace(workspace).chain((result) =>
    _updateAndPersistHistory((history) => _updateFromHistory(result, history))
  );
}

function removeFromHistory(workspace) {
  return _isValidWorkspace(workspace).chain((result) =>
    _updateAndPersistHistory((history) => _removeFromHistory(result, history))
  );
}

module.exports = { getHistory, addToHistory, updateFromHistory, removeFromHistory, setLastOpened, unsetLastOpened };
