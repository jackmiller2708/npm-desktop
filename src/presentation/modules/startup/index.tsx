import { useWorkspace } from "@presentation/hooks/use-workspace";
import { useRootStore } from "@presentation/stores/root";
import { Effect, Either, Option } from "effect";
import { useEffect } from "react";
import { EmptyStartup } from "./_empty-startup";
import { HasProjectStartup } from "./_has-project-startup";
import { ProjectList } from "./components/_project-list";

export function Startup() {
	const mbSetProjects = useRootStore((state) => state.setProjects);
	const mbProjects = useRootStore((state) => state.projects);

	const wp = useWorkspace();

	useEffect(() => {
		Effect.runPromise(Either.all([mbSetProjects, mbProjects]).pipe(
			Either.map(([setProject, projects]) => Effect.Do.pipe(
				Effect.andThen(() => projects.pipe(Option.match({
					onSome: (projectList) => Effect.succeed(Either.right(projectList)),
					onNone: () => wp.getRecents()
				}))),
				Effect.tap(Either.match({
					onRight: (loadedProjects) => setProject(Option.some(loadedProjects)),
					onLeft: () => void 0
				}))
			)),
			Either.getOrThrow
		));
	}, []);

	return mbProjects.pipe(
		Either.map(Option.andThen((projects) => projects.length ? Option.some(projects) : Option.none())),
		Either.map(Option.match({
			onSome: (projects) => (
				<HasProjectStartup>
					<ProjectList projects={projects} />
				</HasProjectStartup>
			),
			onNone: () => <EmptyStartup />
		})),
		Either.getOrThrow
	);
}
