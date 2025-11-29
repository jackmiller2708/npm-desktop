import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@presentation/components/ui/dropdown-menu";
import type { Primitive } from '@radix-ui/react-primitive';
import clsx from "clsx";
import { Match } from "effect";
import { Menu } from "lucide-react";
import type { ComponentPropsWithoutRef, Key } from "react";
import type { MenuCategory, MenuNode } from "./_menu.interface";

function renderMenuNode(node: MenuNode, key: Key) {
	return Match.value(node).pipe(
		Match.when({ type: 'item' }, ({ onSelect, label }) => (
			<DropdownMenuItem key={key} className="text-xs" onSelect={onSelect}>
				{label}
			</DropdownMenuItem>
		)),
		Match.when({ type: 'separator' }, () => <DropdownMenuSeparator key={key} />),
		Match.when({ type: 'submenu' }, ({ label, children }) => (
			<DropdownMenuSub key={key}>
				<DropdownMenuSubTrigger className="text-xs">{label}</DropdownMenuSubTrigger>
				<DropdownMenuPortal>
					<DropdownMenuSubContent>
						{children.map((child, j) => renderMenuNode(child, `${key}-${j}`))}
					</DropdownMenuSubContent>
				</DropdownMenuPortal>
			</DropdownMenuSub>
		)),
		Match.orElseAbsurd
	);
}

export function BurgerMenu({ data, className }: { data: ReadonlyArray<MenuCategory> } & ComponentPropsWithoutRef<typeof Primitive.div>) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger className={clsx("text-muted-foreground py-1 px-2 rounded-sm hover:bg-accent lg:hidden outline-0", className)}>
				<Menu size={18} />
			</DropdownMenuTrigger>

			<DropdownMenuContent align="start">
				{data.map(({ label, children }, i) => (
					<DropdownMenuSub key={i}>
						<DropdownMenuSubTrigger className="text-xs">{label}</DropdownMenuSubTrigger>
						<DropdownMenuPortal>
							<DropdownMenuSubContent>
								{children.map((node, j) => renderMenuNode(node, `${i}-${j}`))}
							</DropdownMenuSubContent>
						</DropdownMenuPortal>
					</DropdownMenuSub>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
