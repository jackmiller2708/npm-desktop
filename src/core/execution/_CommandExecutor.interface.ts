import { Context, Data, Effect, Option } from "effect";

type ResultDataEnum = Data.TaggedEnum<{
  Success: { stdout: string, exitCode: Option.Option<number> },
  Failure: { stderr: string, exitCode: Option.Option<number> }
}>

export type Output = {
	Success: ReturnType<typeof Output.Success>;
	Failure: ReturnType<typeof Output.Failure>;
};

export const Output = Data.taggedEnum<ResultDataEnum>();

export interface CommandContext {
  cwd: string;
  env?: Record<string, string>;
}

export class CommandExecutor extends Context.Tag("CommandExecutor")<CommandExecutor, {
   execute(command: string, args?: string[], context?: CommandContext): Effect.Effect<Output["Success"], Output['Failure']>;
}>() {}