import { NamespaceHandler } from "@types";
import { Schema } from "effect";

export const WindowNamespace = Schema.Struct({
	showOpenDialog: Schema.Struct({
		input: Schema.Void,
		output: Schema.Array(Schema.String),
	}),
	minimize: Schema.Struct({
		input: Schema.Void,
		output: Schema.Void
	}),
	maximize: Schema.Struct({
		input: Schema.Void,
		output: Schema.Void
	}),
	unmaximize: Schema.Struct({
		input: Schema.Void,
		output: Schema.Void
	}),
	close: Schema.Struct({
		input: Schema.Void,
		output: Schema.Void
	})
});

export type WindowNamespace = NamespaceHandler<Schema.Schema.Type<typeof WindowNamespace>>;
