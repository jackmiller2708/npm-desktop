import { Layer } from "effect";
import { IpcHandlerServiceLive } from "./ipc/services/ipc-handler";
import { MainWindowLive } from "./windows/main-window"; 

export const AppLayer = Layer.mergeAll(MainWindowLive, IpcHandlerServiceLive);
