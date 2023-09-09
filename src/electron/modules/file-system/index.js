const { writeFileSync, readFileSync } = require("fs");
const { Either } = require("../../shared/monads/either.monad");
const { IO } = require("../../shared/monads/io.monad");

function readFile(filePath) {
  return IO(() => {
    try {
      return Either.Right(readFileSync(filePath, { encoding: "utf-8" }));
    } catch (error) {
      return Either.Left(error);
    }
  });
}

function writeFile(filePath, data) {
  return IO(() => {
    try {
      writeFileSync(filePath, JSON.parse(data));

      return Either.Right(data);
    } catch (error) {
      return Either.Left(error);
    }
  });
}

module.exports = { readFile, writeFile };
