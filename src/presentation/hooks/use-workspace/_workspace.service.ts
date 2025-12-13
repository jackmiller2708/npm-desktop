import { WorkspaceNamespace } from "@application/ipc/workspace";
import { IPCService } from "@presentation/services/ipc";
import { Params } from "@types";
import { Effect } from "effect";

export class WorkspaceService extends Effect.Service<WorkspaceService>()("app/WorkspaceService", {
  effect: Effect.Do.pipe(
    Effect.andThen(() => IPCService),
    Effect.map((ipc) => ({
      open: (workspacePath: Params<WorkspaceNamespace['open']>) => ipc.invoke("workspace:open", workspacePath),
      getCurrent: () => ipc.invoke("workspace:getCurrent"),
      getRecents: () => ipc.invoke("workspace:getRecents"),
      clearRecents: () => ipc.invoke("workspace:clearRecents"),
      close: () => ipc.invoke("workspace:close")
    }) as const),
  ),
  dependencies: [IPCService.Default]
}) {}
