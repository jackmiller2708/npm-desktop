import { Layer, ManagedRuntime } from "effect";
import { ExecaExecutorLive } from "./execution";
import { NpmHandlerLive, WindowHandlerLive } from "./ipc/handlers";
import { IpcRegistrarLive } from "./ipc/registrar";
import { MainWindowLive } from "./windows/main-window";

export const appRuntime = ManagedRuntime.make(Layer.mergeAll(
  Layer.mergeAll(IpcRegistrarLive, MainWindowLive),
  Layer.mergeAll(Layer.provide(NpmHandlerLive, ExecaExecutorLive), WindowHandlerLive)
));
