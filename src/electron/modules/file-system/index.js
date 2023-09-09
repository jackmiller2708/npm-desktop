const { writeFileSync, readFileSync } = require("fs");
const { Either } = require("../../shared/monads/either.monad");
const { IO } = require("../../shared/monads/io.monad");

/**
 * Reads a file synchronously from the given file path and returns an IO monad
 * containing an Either monad representing the file's content (Right) or an error (Left).
 *
 * @param {string} filePath - The path to the file to read.
 * @returns {IO} - An IO monad that, when executed with .run(), returns an Either monad representing
 * the file content (Right) or an error (Left).
 */
function readFile(filePath) {
  return IO(() => {
    try {
      return Either.Right(readFileSync(filePath, { encoding: "utf-8" }));
    } catch (error) {
      return Either.Left(error);
    }
  });
}


/**
 * Writes data to a file synchronously at the given file path and returns an IO monad
 * containing an Either monad representing the written data (Right) or an error (Left).
 *
 * @param {string} filePath - The path to the file to write.
 * @param {any} data - The data to write to the file.
 * @returns {IO} - An IO monad that, when executed with .run(), returns an Either monad representing
 * the written data (Right) or an error (Left).
 */
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
