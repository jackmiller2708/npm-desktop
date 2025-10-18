import "./App.css";

import { Effect } from "effect/index";
import { useNpm } from "../hooks/useNpm";

export function App() {
	const npm = useNpm();

  function onInstallBtnClick() {
    Effect.runPromise(Effect.Do.pipe(
      Effect.bind('install', () => npm.install('Effect')),
      Effect.andThen(({ install }) => console.log(install))
    ))
  }

	return (
		<button onClick={onInstallBtnClick}>
			Install Effect
		</button>
	);
}
