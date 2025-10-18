import type { Effect } from "effect/Effect";

export interface IIpcHandlerService {
	register: () => Effect<void>;
}
