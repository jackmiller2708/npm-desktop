import { SidebarProvider } from "@presentation/components/ui/sidebar";
import { ProjectInfo } from "@shared/project";
import { Outlet, useLoaderData } from "react-router";
import { AppSidebar } from "./components/layout/sidebar";

export function Project() {
	const project: ProjectInfo = useLoaderData();

	return (
		<SidebarProvider>
			<AppSidebar />
			<main className="p-2">
				<Outlet />
			</main>
		</SidebarProvider>
	);
}
