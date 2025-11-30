import { MenuItem, MenuSubmenu } from "@presentation/components/layout/title-bar-menu/_menu.interface";
import { TitleMenuService } from "@presentation/services/title-menu";
import { Array as Collection, Effect, Either, Option, Record } from "effect/index";
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
		setCurrentProject: (project) => set({ currentProject: project }),
		setProjects: (projects) => set((state) => ({ 
			...state, 
			projects,
			titleBarMenuItems: Effect.runSync(projects.pipe(Option.flatten, Option.match({
				onSome: recents => TitleMenuService.pipe(
					Effect.andThen((service) => service.updateMenuNodeById(state.titleBarMenuItems, 'open-recents', (node) => {
						const openRecentsNode = node as MenuSubmenu;
						const lastOptions = openRecentsNode.children.slice(-2);
						const recentItems = recents.map((project): MenuItem => ({
							id: project.path,
							label: project.path,
							type: 'item'
						}));

						return Record.set(openRecentsNode, 'children', Collection.appendAll(recentItems, lastOptions)) as MenuSubmenu
					})),
					Effect.provide(TitleMenuService.Default)
				),
				onNone: () => Effect.succeed(state.titleBarMenuItems)
			})))
		})),
		addProject: (project) => set((state) =>  ({ 
			...state, 
			projects: state.projects.pipe(
				Option.flatten,
				Option.map(Collection.append(project)),
				Option.map(Collection.dedupe),
				Option.map(Option.some)
			)
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
