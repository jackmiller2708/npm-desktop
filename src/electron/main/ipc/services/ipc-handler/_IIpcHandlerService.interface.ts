import type { HandlerRegistrar, IPCContractRegistry } from "@shared/types/registry";
import type { Effect } from "effect/Effect";

export interface IIpcHandlerService {
	register: <Registry extends IPCContractRegistry>(registrar: HandlerRegistrar<Registry>) => Effect<void>;
}
