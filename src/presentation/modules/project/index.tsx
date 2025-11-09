import { ProjectInfo } from "@shared/project";
import { useLoaderData } from "react-router";

export function Project() {
	const project: ProjectInfo = useLoaderData();

	return <>This is the {project.name}</>;
}
