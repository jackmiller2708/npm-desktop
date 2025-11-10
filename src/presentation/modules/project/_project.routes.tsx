import { defineRoutes } from "@presentation/utilities";
import { Dependencies } from "./modules/dependencies";
import { Overview } from "./modules/overview";
import { Logs } from "./modules/project-logs";
import { Scripts } from "./modules/scripts";
import { Settings } from "./modules/settings";

export const projectRoutes = defineRoutes([
	{ index: true, element: <Overview /> },
	{ path: "dependencies", element: <Dependencies /> },
	{ path: "scripts", element: <Scripts /> },
	{ path: "logs", element: <Logs /> },
	{ path: "settings", element: <Settings /> },
]);
