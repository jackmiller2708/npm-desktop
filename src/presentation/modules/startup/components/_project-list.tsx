import { useWorkspace } from "@presentation/hooks/use-workspace";
import { ProjectInfo } from "@shared/project";
import { Effect, Either } from "effect/index";
import { useNavigate } from "react-router";
import { toast } from "sonner"

interface ProjectListProps {
	projects: ReadonlyArray<ProjectInfo>;
}

export function ProjectList({ projects }: ProjectListProps) {
	const navigate = useNavigate();
	const wp = useWorkspace();

	function onProjectItemClick(path: string) {
		Effect.runPromise(Effect.Do.pipe(
			Effect.andThen(() => wp.open(path)),
			Effect.tap(Either.match({
				onRight: () => navigate('current-project'),
				onLeft: (error) => toast("Unable to open project", { description: error.message }),
			}))
		));
	}

	return (
		<ul>
			{projects.map((project) => (
				<li key={project.path} className="leading-none p-2 cursor-pointer hover:bg-accent" onClick={() => onProjectItemClick(project.path)}>
					<div className="w-2xl">
						<div className="grid grid-cols-12 items-center gap-2">
							<span className="h-8 w-8 flex items-center justify-center uppercase bg-muted-foreground rounded-sm justify-self-end">
								{project.name.at(0)}
							</span>
							<span className="col-span-11">{project.name}</span>
						</div>
						<div className="grid grid-cols-12">
							<br />
							<span className="col-span-11 text-muted-foreground">
								{project.path}
							</span>
						</div>
					</div>
				</li>
			))}
		</ul>
	);
}
