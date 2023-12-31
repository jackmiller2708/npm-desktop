const { ERR_INVALID_WORKSPACE } = require("../../shared/errors/workspace");
const { isWorkspaceValid } = require("../workspace/_service");
const { Either } = require("../../shared/monads/either.monad");
const { IO } = require("../../shared/monads/io.monad");

function validatePathThenAct(path, updateFn) {
  return IO(() =>
    !isWorkspaceValid(path)
      ? Either.Left(new Error(ERR_INVALID_WORKSPACE))
      : updateFn()
  ).run();
}

function ipcReqParser(ipc) {
  return {
    on: (eventName, fn) =>
      ipc.on(eventName, (_, data) => fn(data ? JSON.parse(data) : data)),
  };
}

module.exports = { validatePathThenAct, ipcReqParser };
