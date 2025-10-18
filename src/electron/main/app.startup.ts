import { Effect } from "effect/index";
import { IpcHandlerService } from "./ipc/services/ipc-handler";
import { MainWindow } from "./windows/main-window";

export const startup = Effect.Do.pipe(
  Effect.andThen(() => IpcHandlerService.pipe(Effect.andThen((ipc) => ipc.register()))),
  Effect.andThen(() => MainWindow.pipe(Effect.andThen((win) => win.create())))
);