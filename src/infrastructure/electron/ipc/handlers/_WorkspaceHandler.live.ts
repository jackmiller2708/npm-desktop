import { WorkspaceHandler } from "@application/ipc/workspace";
import { ProjectManager } from "@core/project";
import { Effect, Layer, Option } from "effect";

export const WorkspaceHandlerLive = Layer.effect(WorkspaceHandler, Effect.Do.pipe(
  Effect.andThen(() => ProjectManager),
  Effect.andThen((projectManager) => WorkspaceHandler.of({
    open: (packagePath) => projectManager.open(packagePath),
    getCurrent: () => projectManager.getCurrent().pipe(Effect.andThen(Option.match({
      onSome: Effect.succeed,
      onNone: () => Effect.fail(new Error('No project is currently open'))
    }))),
    clearRecents: () => projectManager.clearRecents(),
    getRecents: () => projectManager.listRecents(),
    close: () => projectManager.close(),
  })),
));
