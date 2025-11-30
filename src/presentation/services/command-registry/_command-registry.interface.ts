import { Effect } from "effect";

export type CommandId =
	| "new-window"
	| "open-folder"
	| "more"
	| "clear-recents"
	| "close-project"
	| "command-palettes"
	| "open-view"
	| "appearance";

export type CommandHandler = () => Effect.Effect<void>;

export interface ICommandRegistryService {
	register: (id: CommandId, handler: CommandHandler) => Effect.Effect<void>;
	execute: (id: CommandId) => Effect.Effect<void>;
}
