import type { ProjectInfo } from "@shared/project";
import type { Option } from "effect/index";
import type { createRootStore } from "./_root.store";

export type RootStoreState = {
	projects: Option.Option<Option.Option<ReadonlyArray<ProjectInfo>>>;
};

export type RootStoreActions = {
	setProjects: (projects: RootStoreState["projects"]) => void;
  addProject: (project: ProjectInfo) => void;
};

export type RootStore = RootStoreState & RootStoreActions;
export type RootStoreContextType = Option.Option<ReturnType<typeof createRootStore>>;
