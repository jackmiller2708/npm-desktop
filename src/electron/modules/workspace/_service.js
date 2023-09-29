const { Observable } = require('rxjs');
const { existsSync } = require("fs");
const { spawn } = require("child_process");
const { watch } = require("chokidar");
const { join } = require("path");

const ENTRY_FILE = "package.json";

function isWorkspaceValid(path) {
  return existsSync(join(path, ENTRY_FILE));
}

function getPackageReader(target) {
  return new Observable((subscriber) => {
    const { stdout } = spawn("npm", ["ls", "--json", "--long"], { cwd: target, shell: true });

    const _emitData = (data) => subscriber.next(data.toString());
    const _completeStream = () => subscriber.complete();

    stdout.on("data", _emitData).on("close", _completeStream);
  });
}

function getPackageWatcher(target) {
  const packageFilePath = join(target, ENTRY_FILE);

  return new Observable((subscriber) => {
    const watcher = watch(packageFilePath, { persistent: true });
    const emit = () => subscriber.next();

    watcher.on("ready", emit).on("change", emit);

    return () => watcher.unwatch(packageFilePath);
  });
}

module.exports = { isWorkspaceValid, getPackageReader, getPackageWatcher };
