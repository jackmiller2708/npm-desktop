import type { HandlerRegistrar, IPCContractRegistry } from "@types";

import { Context } from "effect";

import type { Effect } from "effect/Effect";

export class IpcRegistrar extends Context.Tag("IpcHandlerService")<IpcRegistrar, {
	register: <Registry extends IPCContractRegistry>(registrar: HandlerRegistrar<Registry>) => Effect<void>;
}>() {}