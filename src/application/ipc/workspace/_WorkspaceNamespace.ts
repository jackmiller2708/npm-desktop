import { ProjectInfo } from "@shared/project";
import { NamespaceHandler } from "@types";
import { Schema } from "effect";

export const WorkspaceNamespace = Schema.Struct({
	open: Schema.Struct({
		input: Schema.String,
		output: ProjectInfo,
	}),
	getCurrent: Schema.Struct({
		input: Schema.Void,
		output: ProjectInfo,
	}),
	getRecents: Schema.Struct({
		input: Schema.Void,
		output: Schema.Array(ProjectInfo),
	}),
	clearRecents: Schema.Struct({
		input: Schema.Void,
		output: Schema.Void,
	}),
	close: Schema.Struct({
		input: Schema.Void,
		output: Schema.Void,
	}),
});

export type WorkspaceNamespace = NamespaceHandler<Schema.Schema.Type<typeof WorkspaceNamespace>>;
