import { ProjectInfo } from "@shared/project";

interface ProjectListProps {
	projects: ReadonlyArray<ProjectInfo>;
}

export function ProjectList({ projects }: ProjectListProps) {
	return (
		<ul>
			{projects.map((project) => (
				<li key={project.path} className="leading-none p-2 cursor-pointer hover:bg-accent">
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
