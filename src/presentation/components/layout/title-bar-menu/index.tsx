import type { Primitive } from '@radix-ui/react-primitive';
import type { ComponentPropsWithoutRef } from "react";
import { BurgerMenu } from "./_burger-menu";
import { FullMenu } from "./_full-menu";
import type { MenuCategory } from "./_menu.interface";

export const MENU_DEFINITION: MenuCategory[] = [
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
        ]
      }
    ]
  },
  {
    label: "View",
    children: [
      { type: "item", label: "Command Palette", accelerator: "Ctrl+Shift+P" },
      { type: "item", label: "Open View..." },
      { type: "separator" },
      { type: "item", label: "Appearance..." }
    ]
  },
];

export function TitleBarMenu({ className }: ComponentPropsWithoutRef<typeof Primitive.div>) {
	return (
		<>
      <BurgerMenu data={MENU_DEFINITION} className={className} />
      <FullMenu data={MENU_DEFINITION} className={className} />
		</>
	);
}
