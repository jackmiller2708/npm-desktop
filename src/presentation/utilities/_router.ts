import type { AppRoute } from "@presentation/app.routes";
import { redirect } from "react-router";

export function appRedirect(path: AppRoute) {
	return redirect(path);
}