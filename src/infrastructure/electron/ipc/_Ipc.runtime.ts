import { Layer, ManagedRuntime } from "effect/index";
import { ExecaExecutorLive } from "../execution";
import { NpmHandlerLive, WindowHandlerLive } from "./handlers";

export const ipcRuntime = ManagedRuntime.make(Layer.mergeAll(
  Layer.provide(NpmHandlerLive, ExecaExecutorLive), 
  WindowHandlerLive
));
