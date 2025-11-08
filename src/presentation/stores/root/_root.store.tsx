import { Array as Collection, Either, Option } from "effect/index";
import { createContext, PropsWithChildren, useContext, useState } from "react";
import { createStore, useStore } from "zustand";
import { RootStore, RootStoreContextType } from "./_root.state";

const RootStoreContext = createContext<RootStoreContextType>(Option.none());

export function createRootStore() {
	return createStore<RootStore>()((set) => ({
		projects: Option.none(),
		setProjects: (projects) => set({ projects }),
		addProject: (project) => set(state =>  ({ 
			...state, 
			projects: state.projects.pipe(
				Option.map(Collection.append(project)),
				Option.map(Collection.dedupe)
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
