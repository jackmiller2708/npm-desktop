import { WindowFrame } from "@presentation/components/layout/window-frame";
import { ThemeProvider } from "@presentation/components/theme-provider";
import { RootStoreProvider } from "@presentation/stores/root";
import { Outlet } from "react-router";

export function Root() {
	return (
		<ThemeProvider defaultTheme="system" storageKey="ui-theme">
			<WindowFrame>
				<RootStoreProvider>
					<Outlet />
				</RootStoreProvider>
			</WindowFrame>
		</ThemeProvider>
	);
}
