import { NpmNamespace } from "@application/ipc/npm";
import { WindowNamespace } from "@application/ipc/window";
import { Schema } from "effect";

export const IPCRegistry = Schema.Struct({
	npm: NpmNamespace,
	window: WindowNamespace,
});

export type IPCRegistry = Schema.Schema.Type<typeof IPCRegistry>;
