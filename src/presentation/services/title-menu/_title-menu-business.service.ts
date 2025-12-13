import { MenuCategory, MenuItem, MenuSubmenu } from "@presentation/components/layout/title-bar-menu/_menu.interface";
import { ProjectInfo } from "@shared/project";
import { Array as Collection, Effect, Function as F, Record } from "effect/index";
import { appRuntime } from "../_app.runtime";
import { CommandRegistryService } from "../command-registry";
import { TitleMenuService } from "./_title-menu.service";

interface ITitleMenuBusinessService {
  setRecents: (recents: ReadonlyArray<ProjectInfo>, menuItems: ReadonlyArray<MenuCategory>) => Effect.Effect<ReadonlyArray<MenuCategory>>
}

export class TitleMenuBusinessService extends Effect.Service<ITitleMenuBusinessService>()("app/TitleMenuBusinessService", {
  effect: Effect.Do.pipe(
    Effect.andThen(() => TitleMenuService),
    Effect.map(menu => ({
      setRecents: (recents, menuItems) => menu.updateMenuNodeById(menuItems, 'open-recents', (node) =>
        Record.set(node as MenuSubmenu, 'children', F.pipe(
          recents,
          Collection.map((project): MenuItem => ({
            id: project.path,
            label: project.path,
            type: 'item',
            onSelect: () => appRuntime.runPromise(CommandRegistryService.pipe(
              Effect.andThen((service) => service.execute("open-project", project.path)),
            ))
          })),
          Collection.appendAll((node as MenuSubmenu).children.slice(-2))
        )) as MenuSubmenu
      )
    }) as ITitleMenuBusinessService)
  ),
  dependencies: [TitleMenuService.Default]
}) {}
