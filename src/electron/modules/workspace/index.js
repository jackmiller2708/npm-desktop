const { existsSync } = require("fs");
const { join } = require("path");

const ENTRY_FILE = "package.json";

function isWorkspaceValid(path) {
  return existsSync(join(path, ENTRY_FILE));
}

module.exports = { isWorkspaceValid };
