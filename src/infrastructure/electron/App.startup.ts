import { AppStarter } from "@application/app";
import { NpmHandler } from "@application/ipc/npm";
import { WindowHandler } from "@application/ipc/window";
import { WorkspaceHandler } from "@application/ipc/workspace";
import { IpcRegistrar } from "@core/ipc";
import type { IPCRegistry } from "@shared/ipc/registry";
import { Effect, Layer } from "effect";
import { MainWindow } from "./windows/main-window";

export const AppStarterLive = Layer.effect(AppStarter, Effect.Do.pipe(
  Effect.andThen(() => Effect.all([IpcRegistrar, MainWindow], { concurrency: 'unbounded' })),
  Effect.map(([ipcRegistrar, mainWindow]) => AppStarter.of({
    startup: () => Effect.zipRight(
      ipcRegistrar.register<IPCRegistry>({
        npm: NpmHandler,
        window: WindowHandler,
        workspace: WorkspaceHandler
      }),
      mainWindow.create()
    ),
  })),
));
