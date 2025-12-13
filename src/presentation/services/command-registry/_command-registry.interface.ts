import type { ExtractActionIds } from "@presentation/components/layout/title-bar-menu/_menu.interface";
import type { INIT_MENU_BAR_ITEMS } from "@presentation/stores/root/_root.init";
import { Effect } from "effect";

export type CommandHandler = (...args: any[]) => Effect.Effect<void>;
export type CommandId = ExtractActionIds<typeof INIT_MENU_BAR_ITEMS> | 'open-project';

export interface ICommandRegistryService {
	register: (id: CommandId, handler: CommandHandler) => Effect.Effect<void>;
	execute: (id: CommandId, ...args: any[]) => Effect.Effect<void>;
}
