import * as path from "node:path";

import { Console, Effect, Layer, Option } from "effect";
import { BrowserWindow } from "electron"; 
import { MainWindow } from "./_MainWindow.interface";

declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string;
declare const MAIN_WINDOW_VITE_NAME: string;

export const MainWindowLive = Layer.succeed(MainWindow, MainWindow.of({
  create: () => Effect.Do.pipe(
    Effect.andThen(() => Effect.try({
      try: () => new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: { preload: path.join(__dirname, "../build/preload.js") },
        show: false
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
