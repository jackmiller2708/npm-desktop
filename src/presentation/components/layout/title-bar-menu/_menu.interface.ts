export interface MenuItem {
	id: string;
	label: string;
	accelerator?: string;
	onSelect?: () => void;
	type?: "item";
}

export interface MenuSeparator {
	type: "separator";
}

export interface MenuSubmenu {
	id: string;
	type: "submenu";
	label: string;
	children: MenuNode[];
}

export type MenuNode = MenuItem | MenuSeparator | MenuSubmenu;

export interface MenuCategory {
	id: string;
	type: "category";
	label: string;
	children: ReadonlyArray<MenuNode>;
}

// Explicit Recursion Stack
export type Frame = {
	source: ReadonlyArray<MenuCategory> | ReadonlyArray<MenuNode>;
	rebuilt: MenuCategory[];
	idx: number;
	changed: boolean;
};
