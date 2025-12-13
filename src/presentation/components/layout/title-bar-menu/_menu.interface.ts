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

type ActionableMenuItem = {
  type: "item";
  id: string;
  onSelect: (...args: any[]) => any;
};

export type ExtractActionIds<T> =
  T extends readonly (infer U)[]
    ? ExtractActionIds<U>
    : T extends { children: infer C }
      ? ExtractActionIds<C>
      : T extends ActionableMenuItem
        ? T["id"]
        : never;

// Explicit Recursion Stack
export type Frame = {
	source: ReadonlyArray<MenuCategory> | ReadonlyArray<MenuNode>;
	rebuilt: MenuCategory[];
	idx: number;
	changed: boolean;
};
