import { useRootStore } from '@presentation/stores/root';
import type { Primitive } from '@radix-ui/react-primitive';
import { Either } from 'effect';
import type { ComponentPropsWithoutRef } from "react";
import { BurgerMenu } from "./_burger-menu";
import { FullMenu } from "./_full-menu";

export function TitleBarMenu({ className }: ComponentPropsWithoutRef<typeof Primitive.div>) {
  return useRootStore((state) => state.titleBarMenuItems).pipe(Either.match({
    onRight: (items) => (
      <>
        <BurgerMenu data={items} className={className} />
        <FullMenu data={items} className={className} />
      </>
    ),
    onLeft: () => null
  }));
}
