import { RouteObject } from "react-router";
import { Root } from "./modules/root";
import { Startup } from "./modules/startup";

export const routes: Array<RouteObject> = [
	{
		element: <Root />,
		children: [{ index: true, element: <Startup /> }],
	},
];
