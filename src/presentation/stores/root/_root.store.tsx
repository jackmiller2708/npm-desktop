import { MenuItem, MenuSubmenu } from "@presentation/components/layout/title-bar-menu/_menu.interface";
import { appRuntime } from "@presentation/services/_app.runtime";
import { CommandRegistryService } from "@presentation/services/command-registry";
import { TitleMenuService } from "@presentation/services/title-menu";
import { Array as Collection, Effect, Either, Function as F, Option, Record } from "effect/index";
import { createContext, PropsWithChildren, useContext, useState } from "react";
import { createStore, useStore } from "zustand";
import { INIT_CURRENT_PROJECT, INIT_MENU_BAR_ITEMS, INIT_PROJECTS } from "./_root.init";
import { RootStore, RootStoreContextType } from "./_root.state";

const RootStoreContext = createContext<RootStoreContextType>(Option.none());

export function createRootStore() {
	return createStore<RootStore>()((set) => ({
		projects: INIT_PROJECTS,
		currentProject: INIT_CURRENT_PROJECT,
		titleBarMenuItems: INIT_MENU_BAR_ITEMS,

		//
		setProjects: (projects) => set({ projects }),

		//
		setCurrentProject: (project) => set({ currentProject: project }),

		//
		addProject: (project) => set((state) =>  ({
			...state,
			projects: state.projects.pipe(
				Option.flatten,
				Option.map(Collection.append(project)),
				Option.map(Collection.dedupe),
				Option.some,
			),
		})),

		//
		setMenuRecentItemsByProjects: (projects) => set(state => ({
			...state,
			titleBarMenuItems: appRuntime.runSync(projects.pipe(Option.flatten, Option.match({
				onSome: (availableProjects) =>  TitleMenuService.pipe(Effect.andThen((menuService) =>
					menuService.updateMenuNodeById(state.titleBarMenuItems, 'open-recents', (node) =>
						Record.set(node as MenuSubmenu, 'children', F.pipe(
							availableProjects,
							Collection.map((project): MenuItem => ({
								id: project.path,
								label: project.path,
								type: 'item',
								onSelect: () => appRuntime.runPromise(CommandRegistryService.pipe(
									Effect.andThen((service) => service.execute("open-recent-project", project.path)),
								))
							})),
							Collection.appendAll((node as MenuSubmenu).children.slice(-3))
						)) as MenuSubmenu
					)
				)),
				onNone: () => Effect.succeed(state.titleBarMenuItems)
			})))
		}))
	}));
}

export function RootStoreProvider({ children }: PropsWithChildren) {
	const [rootStore] = useState(createRootStore);

	return (
		<RootStoreContext.Provider value={Option.some(rootStore)}>
			{children}
		</RootStoreContext.Provider>
	);
}

export function useRootStore<U>(selector: (state: RootStore) => U) {
	const mbStore = useContext(RootStoreContext);

	return mbStore.pipe(Option.match({
		onSome: (store) => Either.right(useStore(store, selector)),
		onNone: () => Either.left(new Error("useRootStore must be used within RootStoreProvider")),
	})) as Either.Either<U, Error>;
}
