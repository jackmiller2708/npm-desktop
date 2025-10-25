import { CommandExecutor, Output } from "@core/execution";
import { Effect, Layer, Option } from "effect";

export const ExecaExecutorNpmMockLive = Layer.succeed(CommandExecutor, CommandExecutor.of({
  execute: (command, _args, _context = { cwd: process.cwd() }) => command === 'invalid_command'
    ? Effect.fail(Output.Failure({ stderr: '', exitCode: Option.none() }))
    : Effect.succeed(Output.Success({ stdout: '', exitCode: Option.none() })),
}));