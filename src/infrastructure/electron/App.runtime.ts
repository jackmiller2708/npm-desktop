import { Layer, ManagedRuntime } from "effect/index";
import { IpcRegistrarLive } from "./ipc";
import { MainWindowLive } from "./windows/main-window";

export const appRuntime = ManagedRuntime.make(Layer.mergeAll(IpcRegistrarLive, MainWindowLive));
