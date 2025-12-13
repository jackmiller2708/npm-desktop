import { WindowFrame } from "@presentation/components/layout/window-frame";
import { ThemeProvider } from "@presentation/components/theme-provider";
import { useWorkspace } from "@presentation/hooks/use-workspace";
import { appRuntime } from "@presentation/services/_app.runtime";
import { useRootStore } from "@presentation/stores/root";
import { Effect } from "effect/index";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import { initCommandRegistry, initRecentProjects } from "./root.init";

export function Root() {
	const mbSetCurrentProject = useRootStore((state) => state.setCurrentProject);
	const mbSetProjects = useRootStore((state) => state.setProjects);
	const mbLoadedProjects = useRootStore((state) => state.projects);
	const mbAddProject = useRootStore((state) => state.addProject);
	const wp = useWorkspace();
	const navigate = useNavigate();

	useEffect(() => {
		appRuntime.runPromise(Effect.all([
			initRecentProjects([wp, mbSetProjects, mbLoadedProjects]),
			initCommandRegistry([mbSetCurrentProject, mbAddProject, wp, navigate])
		], { concurrency: 'unbounded' }));
	}, []);

	return (
		<ThemeProvider defaultTheme="system" storageKey="ui-theme">
			<WindowFrame>
				<Outlet />
			</WindowFrame>
		</ThemeProvider>
	);
}
