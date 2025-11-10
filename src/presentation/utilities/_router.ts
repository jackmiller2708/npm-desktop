import type { AppRoute } from "@presentation/app.routes";
import { RouteObject, redirect } from "react-router";

export function appRedirect(path: AppRoute) {
	return redirect(path);
}

export function defineRoutes<const R extends Array<RouteObject>>(r: R) {
	return r;
}
