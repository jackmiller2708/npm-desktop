import type { MenuCategory } from "@presentation/components/layout/title-bar-menu/_menu.interface";
import { appRuntime } from "@presentation/services/_app.runtime";
import { CommandRegistryService } from "@presentation/services/command-registry";
import type { ProjectInfo } from "@shared/project";
import { Effect, Option } from "effect";

export const INIT_MENU_BAR_ITEMS: ReadonlyArray<MenuCategory> = [
	{
		id: "file",
		label: "File",
		type: "category",
		children: [
			{
				id: "new-window",
				type: "item",
				label: "New Window",
				accelerator: "Ctrl+Shift+N",
				onSelect: () => appRuntime.runPromise(CommandRegistryService.pipe(
					Effect.andThen((service) => service.execute("new-window")),
				)),
			},
			{ type: "separator" },
			{
				id: "open-folder",
				type: "item",
				label: "Open Folder",
				accelerator: "Ctrl+K Ctrl+O",
				onSelect: () => appRuntime.runPromise(CommandRegistryService.pipe(
					Effect.andThen((service) => service.execute("open-folder")),
				)),
			},
			{
				id: "open-recents",
				type: "submenu",
				label: "Open Recents",
				children: [
					{
						id: "more",
						type: "item",
						label: "More...",
						accelerator: "Ctrl+R",
						onSelect: () => appRuntime.runPromise(CommandRegistryService.pipe(
							Effect.andThen((service) => service.execute("more")),
						)),
					},
					{
						id: "clear-recents",
						type: "item",
						label: "Clear Recently Opened",
						onSelect: () => appRuntime.runPromise(CommandRegistryService.pipe(
							Effect.andThen((service) => service.execute("clear-recents")),
						)),
					},
				],
			},
			{ type: "separator" },
			{
				id: "close-project",
				type: "item",
				label: "Close Project",
				accelerator: "Ctrl+W",
				onSelect: () => appRuntime.runPromise(CommandRegistryService.pipe(
					Effect.andThen((service) => service.execute("close-project")),
				)),
			},
		],
	},
	{
		id: "view",
		label: "View",
		type: "category",
		children: [
			{
				id: "command-palettes",
				type: "item",
				label: "Command Palette",
				accelerator: "Ctrl+Shift+P",
			},
			{ id: "open-view", type: "item", label: "Open View..." },
			{ type: "separator" },
			{ id: "appearance", type: "item", label: "Appearance..." },
		],
	},
];

export const INIT_PROJECTS: Option.Option<Option.Option<ReadonlyArray<ProjectInfo>>> = Option.none();
export const INIT_CURRENT_PROJECT: Option.Option<ProjectInfo> = Option.none();
