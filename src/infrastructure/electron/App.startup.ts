import { AppStarter } from "@application/app";
import { NpmHandler, WindowHandler } from "@application/ipc/handlers";
import { IpcRegistrar } from "@core/ipc";

import type { IPCRegistry } from "@shared/ipc/registry";

import { Effect, Layer } from "effect";
import { MainWindow } from "./windows/main-window";

export const AppStarterLive = Layer.effect(AppStarter, Effect.Do.pipe(
  Effect.andThen(() => Effect.all([IpcRegistrar, MainWindow], { concurrency: 'unbounded' })),
  Effect.map(([ipcRegistrar, mainWindow]) => AppStarter.of({
    startup: () => Effect.Do.pipe(
      Effect.andThen(() => ipcRegistrar.register<IPCRegistry>({
        npm: NpmHandler,
        window: WindowHandler
      })),
      Effect.andThen(() => mainWindow.create())
    ),
  })),
));
