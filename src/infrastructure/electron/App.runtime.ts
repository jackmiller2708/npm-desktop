import { NodeContext } from "@effect/platform-node/index";
import { Layer, ManagedRuntime } from "effect";
import { ExecaExecutorLive } from "./execution";
import { NpmHandlerLive, WindowHandlerLive } from "./ipc/handlers";
import { WorkspaceHandlerLive } from "./ipc/handlers/_WorkspaceHandler.live";
import { IpcRegistrarLive } from "./ipc/registrar";
import { ProjectManagerCoreLive, ProjectManagerLive } from "./project";
import { MainWindowLive } from "./windows/main-window";

export const appRuntime = ManagedRuntime.make(Layer.mergeAll(
  Layer.mergeAll(IpcRegistrarLive, MainWindowLive),
  Layer.mergeAll(Layer.provide(NpmHandlerLive, ExecaExecutorLive), WindowHandlerLive),
  Layer.provide(WorkspaceHandlerLive, Layer.provide(ProjectManagerLive, Layer.merge(Layer.provide(ProjectManagerCoreLive, NodeContext.layer), NodeContext.layer)))
));
