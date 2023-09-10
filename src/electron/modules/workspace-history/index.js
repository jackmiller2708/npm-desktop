const { _updateAndPersistHistory, _setLastOpened, _unsetLastOpened, _addToHistory, _updateFromHistory, _isValidWorkspace } = require("./_service");
const { _loadData } = require("./_core");

function getHistory() {
  return _loadData().run();
}

function setLastOpened(workspace) {
  return _isValidWorkspace(workspace)
    .chain((result) => _updateAndPersistHistory((history) => _setLastOpened(result, history)))
}

function unsetLastOpened() {
  return _updateAndPersistHistory(history => _unsetLastOpened(history))
    .fold((error) => error, (data) => data);
}

function addToHistory(workspace) {
  return _isValidWorkspace(workspace)
    .chain((result) => _updateAndPersistHistory((history) => _addToHistory(result, history)))
    .fold((error) => error, (data) => data);
}

function updateFromHistory(workspace) {
  return _isValidWorkspace(workspace)
    .chain((result) => _updateAndPersistHistory((history) => _updateFromHistory(result, history)))
    .fold((error) => error, (data) => data);
}


module.exports = { getHistory, addToHistory, updateFromHistory, setLastOpened, unsetLastOpened };
