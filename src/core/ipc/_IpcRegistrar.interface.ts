import type { HandlerRegistrar, HandlerRegistrarShape, IPCContractRegistry, RuntimeDependencies } from "@types";

import { Context, Effect } from "effect";

export class IpcRegistrar extends Context.Tag("IpcHandlerService")<IpcRegistrar, {
	register: <Registry extends IPCContractRegistry>(registrar: HandlerRegistrar<Registry>) => Effect.Effect<void, never, RuntimeDependencies<Registry>>;
}>() {}