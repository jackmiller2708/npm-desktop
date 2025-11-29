import { WindowFrame } from "@presentation/components/layout/window-frame";
import { ThemeProvider } from "@presentation/components/theme-provider";
import { useWorkspace } from "@presentation/hooks/use-workspace";
import { useRootStore } from "@presentation/stores/root";
import { Effect, Either, Option } from "effect/index";
import { useEffect } from "react";
import { Outlet } from "react-router";
import { toast } from "sonner";

export function Root() {
	const mbSetProjects = useRootStore((state) => state.setProjects);
	const mbLoadedProjects = useRootStore((state) => state.projects);
	const wp = useWorkspace();

	useEffect(() => {
		Effect.runPromise(Either.Do.pipe(
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
		));
	}, []);
	
	return (
		<ThemeProvider defaultTheme="system" storageKey="ui-theme">
			<WindowFrame>
				<Outlet />
			</WindowFrame>
		</ThemeProvider>
	);
}
