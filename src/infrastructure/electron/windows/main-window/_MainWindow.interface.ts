import { Context } from "effect";
import type { Effect } from "effect/Effect";

export class MainWindow extends Context.Tag("MainWindow")<MainWindow, {
	create: () => Effect<void, Error>;
}>() {}