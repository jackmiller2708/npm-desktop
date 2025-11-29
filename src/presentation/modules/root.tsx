import { WindowFrame } from "@presentation/components/layout/window-frame";
import { ThemeProvider } from "@presentation/components/theme-provider";
import { Toaster } from "@presentation/components/ui/sonner";
import { Outlet } from "react-router";

export function Root() {
	return (
		<ThemeProvider defaultTheme="system" storageKey="ui-theme">
			<WindowFrame>
				<Outlet />
				<Toaster />
			</WindowFrame>
		</ThemeProvider>
	);
}
