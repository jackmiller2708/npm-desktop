import { RoutePaths } from "@types";
import { Effect, Either } from "effect/index";
import { redirect } from "react-router";
import { useWorkspace } from "./hooks/use-workspace";
import { Project } from "./modules/project";
import { projectRoutes } from "./modules/project/_project.routes";
import { Root } from "./modules/root";
import { Startup } from "./modules/startup";
import { defineRoutes } from "./utilities";

export const routes = defineRoutes([
	{
		element: <Root />,
		children: [
			{ 
				index: true, 
				element: <Startup />,
				loader: async () => Effect.runPromise(useWorkspace().getCurrent().pipe(Effect.andThen(Either.match({
					onRight: () => Effect.sync(() => redirect('current-project')),
					onLeft: () => Effect.void
				}))))
			},
			{
				path: "current-project",
				element: <Project />,
				loader: async () => Effect.runPromise(useWorkspace().getCurrent().pipe(Effect.map(Either.getOrThrow))),
				children: projectRoutes
			},
		],
	},
]);

export type AppRoute = RoutePaths<typeof routes>;
