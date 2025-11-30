import { SidebarProvider } from "@presentation/components/ui/sidebar";
import { useWorkspace } from "@presentation/hooks/use-workspace";
import { appRuntime } from "@presentation/services/_app.runtime";
import { useRootStore } from "@presentation/stores/root";
import { ProjectInfo } from "@shared/project";
import { Effect, Either, Option } from "effect";
import { useEffect } from "react";
import { Outlet, useLoaderData } from "react-router";
import { toast } from "sonner";
import { AppSidebar } from "./components/layout/sidebar";

export function Project() {
	const mbSetCurrentProject = useRootStore((state) => state.setCurrentProject);
	const mbSetProjects = useRootStore((state) => state.setProjects);
	const project: ProjectInfo = useLoaderData();
	const wp = useWorkspace();

	useEffect(() => {
		mbSetCurrentProject.pipe(Either.match({
			onRight: set => set(Option.fromNullable(project)),
			onLeft: (): void => void 0,
		}));
	}, [project]);

	useEffect(() => {
		appRuntime.runPromise(mbSetProjects.pipe(
			Either.map((set) => wp.getRecents().pipe(
				Effect.map(Either.map(Option.some)),
				Effect.map(Either.map(Option.some)),
				Effect.tap(Either.match({
					onRight: set,
					onLeft: (error) => toast("Unable to load projects", { description: error.message })
				})),
			)),
			Either.getOrThrow
		));
	}, []);

	return (
		<SidebarProvider>
			<AppSidebar />
			<main className="p-2">
				<Outlet />
			</main>
		</SidebarProvider>
	);
}
