import type { IPCRegistry } from "@shared/ipc/registry";
import type { RemoteData } from "@shared/ipc/response";
import type { ExtractCommand, ExtractInput, ExtractOutput } from "@types";

import { contextBridge, ipcRenderer } from "electron";

const ipc = {
	invoke: <Cmd extends ExtractCommand<IPCRegistry>>(channel: Cmd, ...args: ExtractInput<IPCRegistry, Cmd>): Promise<RemoteData<ExtractOutput<IPCRegistry, Cmd>, string>> => (
    ipcRenderer.invoke(channel, ...(args as Array<unknown>))
  ),
};

const windowState = {
	onMaximize: (callback: () => void): void => void ipcRenderer.on("window:maximize", callback),
	onUnmaximize: (callback: () => void): void => void ipcRenderer.on("window:unmaximize", callback),
	onMinimize: (callback: () => void): void => void ipcRenderer.on("window:minimize", callback),
}

contextBridge.exposeInMainWorld("ipc", ipc);
contextBridge.exposeInMainWorld('windowState', windowState);

declare global {
	interface Window {
		ipc: typeof ipc;
		windowState: typeof windowState;
	}
}
