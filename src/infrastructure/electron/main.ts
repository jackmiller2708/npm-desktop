import { AppStarter } from "@application/app";
import { Effect } from "effect";
import { app } from "electron";

import started from "electron-squirrel-startup";

import { appRuntime } from "./App.runtime";
import { AppStarterLive } from "./App.startup";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

app.on("ready", () => appRuntime.runPromise(Effect.Do.pipe(
  Effect.andThen(() => AppStarter),
  Effect.andThen((appStarter) => appStarter.startup()),
  Effect.catchAllCause((cause) => Effect.sync(() => {
    console.error("Fatal error", cause);
    app.quit();
  })),
  Effect.provide(AppStarterLive)
)));

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});