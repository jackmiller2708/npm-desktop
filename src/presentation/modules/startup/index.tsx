import { Spinner } from "@presentation/components/ui/spinner";
import { useRootStore } from "@presentation/stores/root";
import { Either, Option } from "effect";
import { EmptyStartup } from "./_empty-startup";
import { HasProjectStartup } from "./_has-project-startup";
import { ProjectList } from "./components/_project-list";

export function Startup() {
	const mbLoadedProjects = useRootStore((state) => state.projects);

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
