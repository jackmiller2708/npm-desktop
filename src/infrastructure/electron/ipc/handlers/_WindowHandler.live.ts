import { WindowHandler } from "@application/ipc/handlers";
import { Effect, Function as Fn, Layer, Option } from "effect";
import { BrowserWindow, dialog, OpenDialogReturnValue } from "electron";

export const WindowHandlerLive = Layer.succeed(WindowHandler, WindowHandler.of({
  showOpenDialog: () => Fn.pipe(
    Option.fromNullable(BrowserWindow.getFocusedWindow()),
    Option.map((win) => Effect.promise(() => dialog.showOpenDialog(win)) as Effect.Effect<OpenDialogReturnValue, Error>),
    Option.getOrElse(() => Effect.fail(new Error("Unable to locate window.")) as Effect.Effect<OpenDialogReturnValue, Error>),
    Effect.map((result) => result.filePaths)
  ),
}));