const { isWorkspaceValid } = require("../workspace/_service");
const { Either } = require("../../shared/monads/either.monad");
const { IO } = require("../../shared/monads/io.monad");

function validatePathThenUpdateHistory(path, updateFn) {
  return IO(() =>
    !isWorkspaceValid(path)
      ? Either.Left(new Error("Invalid Workspace!"))
      : Either.Right(updateFn())
  ).run();
}

module.exports = { validatePathThenUpdateHistory }