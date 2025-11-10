import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@presentation/components/ui/breadcrumb";
import { SidebarProvider } from "@presentation/components/ui/sidebar";
import { ProjectInfo } from "@shared/project";
import { Link, Outlet, useLoaderData } from "react-router";
import { AppSidebar } from "./components/layout/sidebar";

export function Project() {
	const project: ProjectInfo = useLoaderData();

	return (
		<SidebarProvider>
			<AppSidebar />
			<main className="p-2">
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink asChild>
								<Link to="/">Home</Link>
							</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbPage>Breadcrumb</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
				<Outlet />
			</main>
		</SidebarProvider>
	);
}
