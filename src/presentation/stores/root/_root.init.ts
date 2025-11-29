import type { MenuCategory } from "@presentation/components/layout/title-bar-menu/_menu.interface";
import type { ProjectInfo } from "@shared/project";
import { Option } from "effect";

export const INIT_MENU_BAR_ITEMS: ReadonlyArray<MenuCategory> = [
	{
		label: "File",
		children: [
			{ type: "item", label: "New Window", accelerator: "Ctrl+Shift+N" },
			{ type: "separator" },
			{ type: "item", label: "Open Folder", accelerator: "Ctrl+K Ctrl+O" },
			{
				type: "submenu",
				label: "Open Recents",
				children: [
					{ type: "item", label: "Email link" },
					{ type: "item", label: "Messages" },
					{ type: "item", label: "Notes" },
				],
			},
		],
	},
	{
		label: "View",
		children: [
			{ type: "item", label: "Command Palette", accelerator: "Ctrl+Shift+P" },
			{ type: "item", label: "Open View..." },
			{ type: "separator" },
			{ type: "item", label: "Appearance..." },
		],
	},
];

export const INIT_PROJECTS: Option.Option<Option.Option<ReadonlyArray<ProjectInfo>>> = Option.none();
export const INIT_CURRENT_PROJECT: Option.Option<ProjectInfo> = Option.none();