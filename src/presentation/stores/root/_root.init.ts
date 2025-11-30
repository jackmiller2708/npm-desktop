import type { MenuCategory } from "@presentation/components/layout/title-bar-menu/_menu.interface";
import type { ProjectInfo } from "@shared/project";
import { Option } from "effect";

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
			},
			{ type: "separator" },
			{
				id: "open-folder",
				type: "item",
				label: "Open Folder",
				accelerator: "Ctrl+K Ctrl+O",
			},
			{
				id: "open-recents",
				type: "submenu",
				label: "Open Recents",
				children: [
					{ id: "more", type: "item", label: "More" },
					{ id: "clear-recents", type: "item", label: "Clear Recents" },
				],
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
