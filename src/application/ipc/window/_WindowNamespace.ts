import { NamespaceHandler } from "@types";
import { Schema } from "effect";

export const WindowNamespace = Schema.Struct({
	showOpenDialog: Schema.Struct({
		input: Schema.UndefinedOr(Schema.Struct({
			title: Schema.optional(Schema.String),
			filters: Schema.optional(Schema.mutable(Schema.Array(Schema.Struct({
				extensions: Schema.mutable(Schema.Array(Schema.String)),
				name: Schema.String,
			})))),
			defaultPath: Schema.optional(Schema.String),
			properties: Schema.optional(Schema.mutable(Schema.Array(Schema.Literal(
				"openFile",
				"openDirectory",
				"multiSelections",
				"showHiddenFiles",
				"createDirectory",
				"promptToCreate",
				"noResolveAliases",
				"treatPackageAsDirectory",
				"dontAddToRecent",
			)))),
			message: Schema.optional(Schema.String),
			securityScopedBookmarks: Schema.optional(Schema.Boolean),
		})),
		output: Schema.Array(Schema.String),
	}),
	minimize: Schema.Struct({
		input: Schema.Void,
		output: Schema.Void,
	}),
	maximize: Schema.Struct({
		input: Schema.Void,
		output: Schema.Void,
	}),
	unmaximize: Schema.Struct({
		input: Schema.Void,
		output: Schema.Void,
	}),
	close: Schema.Struct({
		input: Schema.Void,
		output: Schema.Void,
	}),
});

export type WindowNamespace = NamespaceHandler<Schema.Schema.Type<typeof WindowNamespace>>;
