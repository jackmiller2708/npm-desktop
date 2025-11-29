import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger } from "@presentation/components/ui/sidebar";
import { BookText, Box, LayoutDashboard, ScrollText, Settings } from "lucide-react";
import { NavLink } from "react-router";

// Menu items.
const items = [
	{
		title: "Overview",
		url: "/current-project",
		icon: LayoutDashboard,
	},
	{
		title: "Dependencies",
		url: "dependencies",
		icon: Box,
	},
	{
		title: "Scripts",
		url: "scripts",
		icon: ScrollText,
	},
	{
		title: "Logs",
		url: "logs",
		icon: BookText,
	},
	{
		title: "Settings",
		url: "settings",
		icon: Settings,
	},
];

export function AppSidebar() {
	return (
		<Sidebar collapsible="icon">
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							<SidebarMenuItem>
								<SidebarMenuButton asChild>
									<SidebarTrigger className="justify-start" />
								</SidebarMenuButton>
							</SidebarMenuItem>
							{items.map((item, index) => (
								<SidebarMenuItem key={item.title} title={item.title}>
									<SidebarMenuButton asChild>
										<NavLink to={item.url} className="[&.active]:bg-accent [&.active]:pointer-events-none" end={index === 0}>
											<item.icon />
											<span>{item.title}</span>
										</NavLink>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	);
}
