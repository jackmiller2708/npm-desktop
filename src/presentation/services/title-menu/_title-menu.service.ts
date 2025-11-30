import type { Frame, MenuCategory, MenuNode } from "@presentation/components/layout/title-bar-menu/_menu.interface";
import { Effect, Function as F, Option } from "effect";
import { hasProperty } from "effect/Predicate";
import { TitleMenuUtilityService } from "./_title-menu-utility.service";

interface ITitleMenuService {
  findMenuNodeById: {
    (id: string): (categories: ReadonlyArray<MenuCategory>) => Effect.Effect<Option.Option<MenuNode | MenuCategory>>;
    (categories: ReadonlyArray<MenuCategory>, id: string): Effect.Effect<Option.Option<MenuNode | MenuCategory>>;
  },
  updateMenuNodeById: {
    (id: string, updater: (node: MenuNode | MenuCategory) => MenuNode | MenuCategory): (categories: ReadonlyArray<MenuCategory>) => Effect.Effect<ReadonlyArray<MenuCategory>>;
    (categories: ReadonlyArray<MenuCategory>, id: string, updater: (node: MenuNode | MenuCategory) => MenuNode | MenuCategory): Effect.Effect<ReadonlyArray<MenuCategory>>;
  };
  // TODO: Implement `insertIntoSubmenu` when needed.
  // insertIntoSubmenu(categories: ReadonlyArray<MenuCategory>, submenuId: string, newNode: MenuNode): Effect.Effect<ReadonlyArray<MenuCategory>>
}

export class TitleMenuService extends Effect.Service<ITitleMenuService>()('app/TitleMenuService', {
  effect: Effect.Do.pipe(
    Effect.andThen(() => TitleMenuUtilityService),
    Effect.andThen(({ menuCategoryBFS, buildMenuNodeStack, menuNodeDFS }) => Effect.sync(() => ({
      findMenuNodeById: F.dual(2, (categories: ReadonlyArray<MenuCategory>, id: string) => Effect.succeed(categories).pipe(
        Effect.andThen(menuCategoryBFS(id)),
        Effect.andThen(Option.match({
          onSome: Effect.succeedSome,
          onNone: () => Effect.succeed(categories).pipe(
            Effect.andThen(buildMenuNodeStack),
            Effect.andThen(menuNodeDFS(id))
          )
        }))
      )),
      updateMenuNodeById: F.dual(3, (categories: ReadonlyArray<MenuCategory>, id: string, updater: (node: MenuNode | MenuCategory) => MenuNode | MenuCategory) => 
        Effect.sync(() => {
          const stack: Frame[] = [{ source: categories, rebuilt: [], idx: 0, changed: false }];

          while (stack.length > 0) {
            const currentFrame = stack[stack.length - 1];

            //#region When frame is done processing, return the result or bubble up to the parent frame.
            if (currentFrame.idx >= currentFrame.source.length) {
              const result = currentFrame.changed ? currentFrame.rebuilt : currentFrame.source;

              // Remove the frame from the stack.
              stack.pop();

              // When stack is done processing.
              if (stack.length === 0) {
                return result as ReadonlyArray<MenuCategory>;
              }

              const parentFrame = stack[stack.length - 1];
              const parentNode = { ...parentFrame.source[parentFrame.idx - 1], children: result } as MenuNode & MenuCategory;

              parentFrame.rebuilt.push(parentNode);
              parentFrame.changed ||= currentFrame.changed;
              continue;
            }
            //#endregion

            //#region Process node of current frame and move to the next source position.
            const node = currentFrame.source[currentFrame.idx++];

            // Category root-level
            if (hasProperty(node, 'type') && node.type === "category") {
              if (node.id === id) {
                currentFrame.rebuilt.push(updater(node) as MenuNode & MenuCategory);
                currentFrame.changed = true;
                continue;
              }

              // Add new frame to process child nodes
              stack.push({ source: node.children, rebuilt: [], idx: 0, changed: false });
              continue;
            }

            // Node frame
            if (hasProperty(node, 'id') && node.id === id) {
              currentFrame.rebuilt.push(updater(node) as MenuNode & MenuCategory);
              currentFrame.changed = true;
              continue;
            }

            if (hasProperty(node, 'type') && node.type === "submenu") {
              // Add new frame to process child nodes
              stack.push({ source: node.children, rebuilt: [], idx: 0, changed: false });
              continue;
            }

            currentFrame.rebuilt.push(node as MenuNode & MenuCategory);
            //#endregion
          }

          return categories;
        })
      ),
    })))
  ),
  dependencies: [TitleMenuUtilityService.Default]
}) {}
