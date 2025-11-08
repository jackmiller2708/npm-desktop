import { NpmNamespace } from "@application/ipc/npm";
import { WindowNamespace } from "@application/ipc/window";
import { WorkspaceNamespace } from "@application/ipc/workspace";
import { Schema } from "effect";

export const IPCRegistry = Schema.Struct({
	npm: NpmNamespace,
	window: WindowNamespace,
	workspace: WorkspaceNamespace
});

export type IPCRegistry = Schema.Schema.Type<typeof IPCRegistry>;
