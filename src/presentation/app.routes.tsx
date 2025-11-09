import { RoutePaths } from "@types";
import { Effect, Either } from "effect/index";
import { RouteObject, redirect } from "react-router";
import { useWorkspace } from "./hooks/use-workspace";
import { Project } from "./modules/project";
import { Root } from "./modules/root";
import { Startup } from "./modules/startup";

function defineRoutes<const R extends RouteObject[]>(r: R) {
	return r;
}

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
				loader: async () => Effect.runPromise(useWorkspace().getCurrent().pipe(Effect.map(Either.getOrThrow)))
			},
		],
	},
]);

export type AppRoute = RoutePaths<typeof routes>;
