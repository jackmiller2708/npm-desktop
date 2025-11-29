import { SidebarProvider } from "@presentation/components/ui/sidebar";
import { useRootStore } from "@presentation/stores/root";
import { ProjectInfo } from "@shared/project";
import { Either, Option } from "effect/index";
import { useEffect } from "react";
import { Outlet, useLoaderData } from "react-router";
import { AppSidebar } from "./components/layout/sidebar";

export function Project() {
	const mbSetCurrentProject = useRootStore((state) => state.setCurrentProject);
	const project: ProjectInfo = useLoaderData();

	useEffect(() => {
		mbSetCurrentProject.pipe(Either.match({
			onRight: set => set(Option.fromNullable(project)),
			onLeft: (): void => void 0,
		}));
	}, [project]);

	return (
		<SidebarProvider>
			<AppSidebar />
			<main className="p-2">
				<Outlet />
			</main>
		</SidebarProvider>
	);
}
