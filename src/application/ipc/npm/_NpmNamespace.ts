import { NamespaceHandler } from "@types";
import { Schema } from "effect";

export const NpmNamespace = Schema.Struct({
	install: Schema.Struct({
		input: Schema.String,
		output: Schema.String,
	}),
	list: Schema.Struct({
		input: Schema.Struct({
			json: Schema.Boolean,
		}),
		output: Schema.String,
	}),
});

export type NpmNamespace = NamespaceHandler<Schema.Schema.Type<typeof NpmNamespace>>;
