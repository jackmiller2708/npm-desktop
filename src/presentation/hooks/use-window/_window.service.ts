import type { WindowNamespace } from "@application/ipc/window";

import { IPCService } from "@presentation/services/ipc";
import { Params } from "@types";
import { Effect } from "effect";

export class WindowService extends Effect.Service<WindowService>()('app/WindowService', {
  effect: Effect.Do.pipe(
    Effect.andThen(() => IPCService),
    Effect.map((ipc) => ({
      showOpenDialog: (options?: Params<WindowNamespace['showOpenDialog']>) => ipc.invoke("window:showOpenDialog", options),
      maximize: () => ipc.invoke("window:maximize"),
      unmaximize: () => ipc.invoke("window:unmaximize"),
      minimize: () => ipc.invoke("window:minimize"),
      close: () => ipc.invoke("window:close"),
    }) as const)
  ),
  dependencies: [IPCService.Default]
}) {}

