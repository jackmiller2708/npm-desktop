import "./App.css";

import { Effect } from "effect/index";
import { useNpm } from "../hooks/useNpm";

export function App() {
	const npm = useNpm();

	function onInstallBtnClick() {
		Effect.runPromise(npm.install("Effect"));
	}

	return <button onClick={onInstallBtnClick}>Install Effect</button>;
}
