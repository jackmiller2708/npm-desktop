import type { MenuCategory, MenuNode } from "@presentation/components/layout/title-bar-menu/_menu.interface";
import { Effect, Function as F, Option } from "effect";

interface ITitleMenuUtilityService {
	buildMenuNodeStack(categories: ReadonlyArray<MenuCategory> ): Effect.Effect<MenuNode[]>;
	menuNodeDFS: {
		(id: string): (stack: MenuNode[]) => Effect.Effect<Option.Option<MenuNode>>;
		(stack: MenuNode[], id: string): Effect.Effect<Option.Option<MenuNode>>;
	};
  menuCategoryBFS: {
    (id: string): (categories: ReadonlyArray<MenuCategory>) => Effect.Effect<Option.Option<MenuCategory>>;
    (categories: ReadonlyArray<MenuCategory>, id: string): Effect.Effect<Option.Option<MenuCategory>>;
  };
}

export class TitleMenuUtilityService extends Effect.Service<ITitleMenuUtilityService>()('app/TitleMenuUtilityService', {
  effect: Effect.sync(() => ({
    buildMenuNodeStack: (categories: ReadonlyArray<MenuCategory>) => {
      const stack: MenuNode[] = [];

      for (let i = categories.length - 1; i >= 0; i--) {
        const cat = categories[i];

        for (let j = cat.children.length - 1; j >= 0; j--) {
          stack.push(cat.children[j]);
        }
      }

      return Effect.succeed(stack);
    },
    menuNodeDFS: F.dual(2, (stack: MenuNode[], id: string) => {
      while (stack.length > 0) {
        const node = stack.pop() as MenuNode;

        if ("id" in node && node.id === id) {
          return Effect.succeed(Option.some(node));
        }

        if (node.type === "submenu") {
          const children = node.children;

          for (let i = children.length - 1; i >= 0; i--) {
            stack.push(children[i]);
          }
        }
      }

      return Effect.succeed(Option.none());
    }),
    menuCategoryBFS: F.dual(2, (categories: ReadonlyArray<MenuCategory>, id: string) => {
      return Effect.sync(() => {
        for (const category of categories) {
          if (category.id === id) {
            return Option.some(category);
          }
        }

        return Option.none();
      });
    })
  })),
}) {}