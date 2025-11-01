import "./App.css";

import { Button } from "@presentation/components/ui/button";
import { Effect } from "effect/index";
import { useNpm } from "../hooks/useNpm";
import { useWindow } from "../hooks/useWindow";

export function App() {
	const npm = useNpm();
	const win = useWindow();

	function onInstallBtnClick() {
		Effect.runPromise(npm.list());
	}

	function onOpenDialogClick() {
		Effect.runPromise(win.showOpenDialog())
	}

	return (
		<>
			<Button variant="outline" onClick={onInstallBtnClick}>List Packages</Button>
			<Button variant="outline" onClick={onOpenDialogClick}>Open Dialog</Button>
		</>
	);
}
