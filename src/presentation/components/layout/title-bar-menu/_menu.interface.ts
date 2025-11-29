export interface MenuItemBase {
	label: string;
	accelerator?: string;
	onSelect?: () => void;
}

export interface MenuItem extends MenuItemBase {
	type?: "item";
}

export interface MenuSeparator {
	type: "separator";
}

export interface MenuSubmenu {
	type: "submenu";
	label: string;
	children: MenuNode[];
}

export type MenuNode = MenuItem | MenuSeparator | MenuSubmenu;

export interface MenuCategory {
	label: string;
	children: MenuNode[];
}
