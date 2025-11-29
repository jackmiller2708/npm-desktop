import { WindowFrame } from "@presentation/components/layout/window-frame";
import { ThemeProvider } from "@presentation/components/theme-provider";
import { Toaster } from "@presentation/components/ui/sonner";
import { RootStoreProvider } from "@presentation/stores/root";
import { Outlet } from "react-router";

export function Root() {
	return (
		<ThemeProvider defaultTheme="system" storageKey="ui-theme">
			<RootStoreProvider>
				<WindowFrame>
					<Outlet />
					<Toaster />
				</WindowFrame>
			</RootStoreProvider>
		</ThemeProvider>
	);
}
