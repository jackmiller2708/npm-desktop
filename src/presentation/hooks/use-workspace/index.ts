import { WorkspaceNamespace } from "@application/ipc/workspace";
import { IPCService } from "@presentation/services/ipc";
import { Params } from "@types";
import { Effect } from "effect";
import { WorkspaceService } from "./_workspace.service";

export function useWorkspace() {
  return {
    open: (path: Params<WorkspaceNamespace['open']>) => WorkspaceService.pipe(
      Effect.andThen(workspace => workspace.open(path)),
      Effect.andThen(IPCService.Interceptors.transformResponseInterceptor()),
      Effect.either,
      Effect.provide(WorkspaceService.Default)
    ),
    getCurrent: () => WorkspaceService.pipe(
      Effect.andThen(workspace => workspace.getCurrent()),
      Effect.andThen(IPCService.Interceptors.transformResponseInterceptor()),
      Effect.either,
      Effect.provide(WorkspaceService.Default)
    )
  }
}