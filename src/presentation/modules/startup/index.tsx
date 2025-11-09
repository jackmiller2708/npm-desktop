import { Spinner } from "@presentation/components/ui/spinner";
import { useWorkspace } from "@presentation/hooks/use-workspace";
import { useRootStore } from "@presentation/stores/root";
import { Effect, Either, Option } from "effect";
import { useEffect } from "react";
import { useNavigate, useNavigation } from "react-router";
import { toast } from "sonner";
import { EmptyStartup } from "./_empty-startup";
import { HasProjectStartup } from "./_has-project-startup";
import { ProjectList } from "./components/_project-list";

export function Startup() {
	const mbSetProjects = useRootStore((state) => state.setProjects);
	const mbLoadedProjects = useRootStore((state) => state.projects);
	const wp = useWorkspace();
	const navigate = useNavigate();
	const navigation = useNavigation();

	useEffect(() => {
		Effect.runPromise(Either.Do.pipe(
			Either.andThen(() => Either.all([mbSetProjects, mbLoadedProjects])),
			Either.map(([setProject, projects]) => Effect.Do.pipe(
				Effect.andThen(() => Option.flatten(projects).pipe(Option.match({
					onSome: (projectList) => Effect.succeed(Either.right(projectList)),
					onNone: wp.getRecents
				}))),
				Effect.map(Either.map(Option.some)),
				Effect.map(Either.map(Option.some)),
				Effect.tap(Either.match({
					onRight: setProject,
					onLeft: (error) => toast("Unable to load projects", { description: error.message })
				})),
			)),
			Either.getOrThrow
		));
	}, []);

	useEffect(() => {
		Effect.runPromise(Effect.Do.pipe(
			Effect.andThen(() => wp.getCurrent()),
			Effect.tap(Either.match({
				onRight: () => navigation.state === 'idle' && navigate('current-project'),
				onLeft: (error): void => error.message === 'No project is currently open' 
					? void 0 
					: void toast("Unable to load last open project", { description: error.message })
			}))
		));
	}, [mbLoadedProjects])

	return mbLoadedProjects.pipe(
		Either.map(Option.match({
			onSome: (mbProjects) => mbProjects.pipe(
				Option.andThen((projects) => projects.length ? Option.some(projects) : Option.none()),
				Option.match({
					onSome: (projects) => (
						<HasProjectStartup>
							<ProjectList projects={projects} />
						</HasProjectStartup>
					),
					onNone: () => <EmptyStartup />
				})
			),
			onNone: () => (
				<div className="h-screen w-screen flex items-center justify-center">
					<Spinner className="size-8" />
				</div>
			),
		})),
		Either.getOrThrow
	);
}
