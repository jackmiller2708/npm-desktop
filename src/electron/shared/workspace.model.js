const { Record } = require("immutable");

module.exports = {
  Workspace: Record({ path: "", name: "", timestamp: Date.now() }),
};
