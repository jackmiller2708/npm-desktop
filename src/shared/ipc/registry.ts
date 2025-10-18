import { Schema } from "effect";

import type { ExtractCommand } from "./types";

export const IPCRegistry = Schema.Struct({
	npm: Schema.Struct({
		install: Schema.Struct({
			input: Schema.Tuple(Schema.String),
			output: Schema.Struct({ success: Schema.Boolean }),
		}),
	}),
});

export type IPCRegistry = Schema.Schema.Type<typeof IPCRegistry>;
export type Command = ExtractCommand<typeof IPCRegistry>;
