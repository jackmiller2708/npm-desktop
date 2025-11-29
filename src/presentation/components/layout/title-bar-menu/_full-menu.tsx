import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarShortcut, MenubarSub, MenubarSubContent, MenubarSubTrigger, MenubarTrigger } from "@presentation/components/ui/menubar";
import type { Primitive } from '@radix-ui/react-primitive';
import clsx from "clsx";
import { Match } from "effect";
import type { ComponentPropsWithoutRef, Key } from "react";
import type { MenuCategory, MenuNode } from "./_menu.interface";

function renderMenuNode(node: MenuNode, key: Key) {
  return Match.value(node).pipe(
    Match.when({ type: 'item' }, ({ label, accelerator, onSelect }) => (
      <MenubarItem key={key} className="text-xs" onSelect={onSelect}>
        {label}
        {accelerator && (
          <MenubarShortcut className="text-xs">
            {accelerator}
          </MenubarShortcut>
        )}
      </MenubarItem>
    )),
    Match.when({ type: 'separator' }, () => <MenubarSeparator key={key} />),
    Match.when({ type: 'submenu' }, ({ label, children }) => (
      <MenubarSub key={key}>
        <MenubarSubTrigger className="text-xs">{label}</MenubarSubTrigger>
        <MenubarSubContent>
          {children.map((child, j) => renderMenuNode(child, `${key}-${j}`))}
        </MenubarSubContent>
      </MenubarSub>
    )),
    Match.orElseAbsurd
  );
}

export function FullMenu({ data, className }: { data: MenuCategory[] } & ComponentPropsWithoutRef<typeof Primitive.div>) {
	return (
    <Menubar className={clsx("p-0 border-0 h-fit hidden lg:flex", className)}>
      {data.map(({ label, children }) => (
        <MenubarMenu key={label}>
          <MenubarTrigger className="text-xs text-muted-foreground hover:bg-accent">
            {label}
          </MenubarTrigger>
          <MenubarContent>
            {children.map((node, i) => renderMenuNode(node, i))}
          </MenubarContent>
        </MenubarMenu>
      ))}
    </Menubar>
  );
}
