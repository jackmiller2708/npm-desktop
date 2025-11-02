import { WindowFrame } from "@presentation/components/layout/window-frame";
import { ThemeProvider } from "@presentation/components/theme-provider";
import { Outlet } from "react-router";

export function Root() {
	return (
		<ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
			<WindowFrame>
      	<Outlet />
			</WindowFrame>
    </ThemeProvider>
	);
}
