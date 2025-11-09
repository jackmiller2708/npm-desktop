import { Effect, Either } from "effect/index";
import { RouteObject } from "react-router";
import { useWorkspace } from "./hooks/use-workspace";
import { Project } from "./modules/project";
import { Root } from "./modules/root";
import { Startup } from "./modules/startup";

export const routes: Array<RouteObject> = [
	{
		element: <Root />,
		children: [
			{ index: true, element: <Startup /> },
			{
				path: "current-project",
				element: <Project />,
				loader: async () => Effect.runPromise(useWorkspace().getCurrent().pipe(Effect.map(Either.getOrThrow)))
			},
		],
	},
];
