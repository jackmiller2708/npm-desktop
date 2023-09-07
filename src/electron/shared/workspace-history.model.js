const { Record, List } = require("immutable");

module.exports = {
  WorkspaceHistory: Record({ workspaces: List(), lastOpened: undefined }),
};
