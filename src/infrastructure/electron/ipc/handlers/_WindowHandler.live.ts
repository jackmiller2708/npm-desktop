import { WindowHandler } from "@application/ipc/window";
import { Effect, Function as Fn, Layer, Option } from "effect";
import { BrowserWindow, dialog, OpenDialogReturnValue } from "electron";

export const WindowHandlerLive = Layer.succeed(WindowHandler, WindowHandler.of({
  showOpenDialog: (options) => Fn.pipe(
    Option.fromNullable(BrowserWindow.getFocusedWindow()),
    Option.map((win) => Effect.promise(() => dialog.showOpenDialog(win, options ?? {})) as Effect.Effect<OpenDialogReturnValue, Error>),
    Option.getOrElse(() => Effect.fail(new Error("Unable to locate window.")) as Effect.Effect<OpenDialogReturnValue, Error>),
    Effect.map((result) => result.filePaths)
  ),
  minimize: () => Fn.pipe(
    Option.fromNullable(BrowserWindow.getFocusedWindow()),
    Option.map((win) => Effect.sync(() => win.minimize())),
    Option.getOrElse(() => Effect.void)
  ),
  unmaximize: () => Fn.pipe(
    Option.fromNullable(BrowserWindow.getFocusedWindow()),
    Option.map((win) => Effect.sync(() => win.unmaximize())),
    Option.getOrElse(() => Effect.void)
  ),
  maximize: () => Fn.pipe(
    Option.fromNullable(BrowserWindow.getFocusedWindow()),
    Option.map((win) => Effect.sync(() => win.maximize())),
    Option.getOrElse(() => Effect.void)
  ),
  close: () => Fn.pipe(
    Option.fromNullable(BrowserWindow.getFocusedWindow()),
    Option.map((win) => Effect.sync(() => win.close())),
    Option.getOrElse(() => Effect.void)
  )
}));
