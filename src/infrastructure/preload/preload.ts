import type { IPCRegistry } from "@shared/ipc/registry";
import type { RemoteData } from "@shared/ipc/response";

import { ExtractCommand, ExtractInput, ExtractOutput } from "@types";
import { contextBridge, ipcRenderer } from "electron";

const ipc = {
	invoke: async <Cmd extends ExtractCommand<IPCRegistry>>(channel: Cmd, ...args: ExtractInput<IPCRegistry, Cmd>): Promise<RemoteData<ExtractOutput<IPCRegistry, Cmd>, string>> => (
    ipcRenderer.invoke(channel, ...(args as Array<unknown>))
  ),
};

contextBridge.exposeInMainWorld("ipc", ipc);

declare global {
	interface Window {
		ipc: typeof ipc;
	}
}
