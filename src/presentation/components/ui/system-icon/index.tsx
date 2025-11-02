import { Option, Record } from "effect";
import { FluentIconName, FluentIcons } from "./_fluent-icons";

export function SystemIcon({ name }: { name: FluentIconName }) {
	return (
		<span className="font-ui">
			{Option.Do.pipe(
				Option.andThen(() => Record.get(FluentIcons, name)),
				Option.getOrElse(() => FluentIcons["Question"]),
			)}
		</span>
	);
}
