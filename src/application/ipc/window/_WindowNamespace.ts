import { NamespaceHandler } from "@types";
import { Schema } from "effect";

export const WindowNamespace = Schema.Struct({
	showOpenDialog: Schema.Struct({
		input: Schema.Array(Schema.Void),
		output: Schema.Array(Schema.String),
	}),
});

export type WindowNamespace = NamespaceHandler<Schema.Schema.Type<typeof WindowNamespace>>;
