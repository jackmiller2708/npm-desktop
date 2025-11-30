import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarShortcut, MenubarSub, MenubarSubContent, MenubarSubTrigger, MenubarTrigger } from "@presentation/components/ui/menubar";
import type { Primitive } from '@radix-ui/react-primitive';
import clsx from "clsx";
import { Match, Option } from "effect";
import type { ComponentPropsWithoutRef, Key } from "react";
import type { MenuCategory, MenuNode } from "./_menu.interface";

function renderMenuNode(node: MenuNode, key: Key) {
  return Match.value(node).pipe(
    Match.when({ type: 'item' }, ({ label, accelerator: mbAccelerator, onSelect, id }) => (
      <MenubarItem key={id} className="text-xs" onSelect={onSelect}>
        {label}
        {Option.fromNullable(mbAccelerator).pipe(
          Option.map((accelerator) => <MenubarShortcut className="text-xs">{accelerator}</MenubarShortcut>),
          Option.getOrNull
        )}
      </MenubarItem>
    )),
    Match.when({ type: 'separator' }, () => <MenubarSeparator key={key} />),
    Match.when({ type: 'submenu' }, ({ label, children, id }) => (
      <MenubarSub key={id}>
        <MenubarSubTrigger className="text-xs">{label}</MenubarSubTrigger>
        <MenubarSubContent>
          {children.map((child, j) => renderMenuNode(child, `${key}-${j}`))}
        </MenubarSubContent>
      </MenubarSub>
    )),
    Match.orElseAbsurd
  );
}

export function FullMenu({ data, className }: { data: ReadonlyArray<MenuCategory> } & ComponentPropsWithoutRef<typeof Primitive.div>) {
	return (
    <Menubar className={clsx("p-0 border-0 h-fit hidden lg:flex", className)}>
      {data.map(({ label, children, id }) => (
        <MenubarMenu key={id}>
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
