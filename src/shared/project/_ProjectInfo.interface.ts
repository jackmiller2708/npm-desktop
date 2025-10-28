import { Schema } from "effect/index";

export const ProjectInfo = Schema.Struct({
	path: Schema.String,
	name: Schema.String,
	packageJsonPath: Schema.String,
	dependencies: Schema.Record({ key: Schema.String, value: Schema.String }),
	devDependencies: Schema.Record({ key: Schema.String, value: Schema.String }),
	lastOpened: Schema.Number,
});

export type ProjectInfo = Schema.Schema.Type<typeof ProjectInfo>;
