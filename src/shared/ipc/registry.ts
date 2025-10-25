import type { ExtractCommand } from "@types";

import { Schema } from "effect";

export const IPCRegistry = Schema.Struct({
	npm: Schema.Struct({
		install: Schema.Struct({
			input: Schema.Array(Schema.String),
			output: Schema.String,
		}),
	}),
	window: Schema.Struct({
		showOpenDialog: Schema.Struct({
			input: Schema.Array(Schema.Void),
			output: Schema.Array(Schema.String)
		})
	})
});

export type IPCRegistry = Schema.Schema.Type<typeof IPCRegistry>;
export type Command = ExtractCommand<IPCRegistry>;
