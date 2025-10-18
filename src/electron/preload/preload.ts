import type { IPCRegistry } from "@shared/ipc/registry";

import { ExtractCommand, ExtractInput, ExtractOutput } from "@shared/ipc/types";
import { contextBridge, ipcRenderer } from "electron";

const ipc = {
	invoke: async <Cmd extends ExtractCommand<IPCRegistry>>(
		channel: Cmd,
		...args: ExtractInput<IPCRegistry, Cmd>
	): Promise<ExtractOutput<IPCRegistry, Cmd>> =>
		ipcRenderer.invoke(channel, ...(args as Array<unknown>)),
};

contextBridge.exposeInMainWorld("ipc", ipc);

declare global {
	interface Window {
		ipc: typeof ipc;
	}
}
