import type { MenuCategory } from "@presentation/components/layout/title-bar-menu/_menu.interface";
import type { ProjectInfo } from "@shared/project";
import type { Option } from "effect/index";
import type { createRootStore } from "./_root.store";

export type RootStoreState = {
	projects: Option.Option<Option.Option<ReadonlyArray<ProjectInfo>>>;
	currentProject: Option.Option<ProjectInfo>;
	titleBarMenuItems: ReadonlyArray<MenuCategory>
};

export type RootStoreActions = {
	setCurrentProject: (project: RootStore["currentProject"]) => void;
	setProjects: (projects: RootStoreState["projects"]) => void;
  addProject: (project: ProjectInfo) => void;
};

export type RootStore = RootStoreState & RootStoreActions;
export type RootStoreContextType = Option.Option<ReturnType<typeof createRootStore>>;
