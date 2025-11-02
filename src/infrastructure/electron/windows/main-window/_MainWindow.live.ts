import * as path from "node:path";

import { Console, Effect, Layer, Option } from "effect";
import { BrowserWindow } from "electron"; 
import { MainWindow } from "./_MainWindow.interface";

declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string;
declare const MAIN_WINDOW_VITE_NAME: string;

const WINDOW_FRAME_HEIGHT_PX = 32;
const MIN_CONTENT_HEIGHT = 356; // Height of the startup window.

export const MainWindowLive = Layer.succeed(MainWindow, MainWindow.of({
  create: () => Effect.Do.pipe(
    Effect.andThen(() => Effect.try({
      try: () => new BrowserWindow({
        minWidth: 832,
        width: 823,
        minHeight: MIN_CONTENT_HEIGHT + WINDOW_FRAME_HEIGHT_PX,
        height: MIN_CONTENT_HEIGHT + WINDOW_FRAME_HEIGHT_PX,
        webPreferences: { preload: path.join(__dirname, "../build/preload.js") },
        show: false,
        frame: false,
      }),
      catch: (error) => error as Error,
    })),
    Effect.tap((win) => win.on('closed', () => Effect.runSync(Console.log('Main window closed')))),
    Effect.tap((win) => win.on('ready-to-show', () => win.show())),
    Effect.andThen((win) => Effect.promise(() => Option.fromNullable(MAIN_WINDOW_VITE_DEV_SERVER_URL).pipe(Option.match({
      onSome: (url) => win.loadURL(url),
      onNone: () => win.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`))
    })))),
  ),
}));
