import { ThemeProvider } from "@presentation/components/theme-provider";
import { Outlet } from "react-router";

export function Root() {
	return (
		<ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Outlet />
    </ThemeProvider>
	);
}
