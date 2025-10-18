import type { Effect } from "effect/Effect";

export interface IMainWindow {
	create: () => Effect<void, Error>;
}
