import { WindowFrame } from "@presentation/components/layout/window-frame";
import { ThemeProvider } from "@presentation/components/theme-provider";
import { useWorkspace } from "@presentation/hooks/use-workspace";
import { appRuntime } from "@presentation/services/_app.runtime";
import { CommandRegistryService } from "@presentation/services/command-registry";
import { useRootStore } from "@presentation/stores/root";
import { Effect, Either, Option } from "effect/index";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import { toast } from "sonner";

export function Root() {
	const mbSetCurrentProject = useRootStore((state) => state.setCurrentProject);
	const mbSetProjects = useRootStore((state) => state.setProjects);
	const mbLoadedProjects = useRootStore((state) => state.projects);
	const wp = useWorkspace();
	const navigate = useNavigate();

	function initRecentProjects() {
		return Either.Do.pipe(
			Either.andThen(() => Either.all([mbSetProjects, mbLoadedProjects])),
			Either.map(([setProjects, projects]) => Effect.Do.pipe(
				Effect.andThen(() => Option.flatten(projects).pipe(Option.match({
					onSome: (projectList) => Effect.succeed(Either.right(projectList)),
					onNone: wp.getRecents
				}))),
				Effect.map(Either.map(Option.some)),
				Effect.map(Either.map(Option.some)),
				Effect.tap(Either.match({
					onRight: setProjects,
					onLeft: (error) => toast("Unable to load projects", { description: error.message })
				})),
			)),
			Either.getOrThrow
		);
	}

	function initCommandRegistry() {
		return CommandRegistryService.pipe(Effect.andThen((service) => Effect.all([
			service.register("close-project", () => wp.close().pipe(
				Effect.tap(() => mbSetCurrentProject.pipe(Either.match({
					onRight: set => set(Option.none()),
					onLeft: (): void => void 0,
				}))),
				Effect.tap(() => navigate('/'))
			))
		])));
	}

	useEffect(() => {
		appRuntime.runPromise(
			Effect.all([initRecentProjects(), initCommandRegistry()]),
		);
	}, []);

	return (
		<ThemeProvider defaultTheme="system" storageKey="ui-theme">
			<WindowFrame>
				<Outlet />
			</WindowFrame>
		</ThemeProvider>
	);
}
