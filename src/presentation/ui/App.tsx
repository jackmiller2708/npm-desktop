import "./App.css";

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
			<button onClick={onInstallBtnClick}>List Packages</button>
			<button onClick={onOpenDialogClick}>Open Dialog</button>
		</>
	);
}
