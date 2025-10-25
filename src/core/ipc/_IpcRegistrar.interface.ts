import type { HandlerRegistrar, HandlerRegistrarShape, IPCContractRegistry } from "@types";

import { Context, Effect } from "effect";

export class IpcRegistrar extends Context.Tag("IpcHandlerService")<IpcRegistrar, {
	register: <Registry extends IPCContractRegistry>(registrar: HandlerRegistrar<Registry>) => Effect.Effect<
		void,
		never,
		HandlerRegistrarShape<Registry>[keyof HandlerRegistrarShape<Registry>]
	>;
}>() {}