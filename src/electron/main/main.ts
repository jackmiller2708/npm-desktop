import { Effect } from "effect/index";
import { app } from "electron";
import started from "electron-squirrel-startup";
import { appRuntime } from "./app.runtime";
import { startup } from "./app.startup";


// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

app.on("ready", () => appRuntime.runPromise(Effect.Do.pipe(
  Effect.andThen(() => startup),
  Effect.catchAllCause((cause) => Effect.sync(() => {
    console.error("Fatal error", cause);
    app.quit();
  })),
)));

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
