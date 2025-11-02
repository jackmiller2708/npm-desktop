import { IPCService } from "@presentation/services/ipc";
import { Effect } from "effect/index";

export class WindowService extends Effect.Service<WindowService>()('app/WindowService', {
  effect: Effect.Do.pipe(
    Effect.andThen(() => IPCService),
    Effect.map((ipc) => ({
      showOpenDialog: () => ipc.invoke("window:showOpenDialog"),
      maximize: () => ipc.invoke("window:maximize"),
      unmaximize: () => ipc.invoke("window:unmaximize"),
      minimize: () => ipc.invoke("window:minimize"),
      close: () => ipc.invoke("window:close"),
    }) as const)
  ),
  dependencies: [IPCService.Default]
}) {}