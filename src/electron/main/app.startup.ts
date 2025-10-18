import type { IPCRegistry } from "@shared/ipc/registry";

import { Effect } from "effect/index";
import { NpmHandler } from "./ipc/handlers/npm-handler/_NpmHandler";
import { IpcHandlerService } from "./ipc/services/ipc-handler";
import { MainWindow } from "./windows/main-window";

export const startup = Effect.Do.pipe(
  Effect.andThen(() => IpcHandlerService.pipe(Effect.andThen((ipc) => ipc.register<IPCRegistry>({
    npm: NpmHandler
  })))),
  Effect.andThen(() => MainWindow.pipe(Effect.andThen((win) => win.create())))
);