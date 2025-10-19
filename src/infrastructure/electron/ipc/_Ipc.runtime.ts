import { Layer, ManagedRuntime } from "effect/index";
import { NpmHandlerLive } from "./handlers";

export const ipcRuntime = ManagedRuntime.make(Layer.mergeAll(NpmHandlerLive));
