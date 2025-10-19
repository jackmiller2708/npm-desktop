import { CommandExecutor, Output } from "@core/execution";
import { Effect, Layer, Option, String as Str } from "effect";
import { $, ExecaError } from "execa";

export const ExecaExecutorLive = Layer.succeed(CommandExecutor, CommandExecutor.of({
  execute: (command, args, context = { cwd: process.cwd() }) => Effect.Do.pipe(
    Effect.andThen(() => Effect.tryPromise({
      try: (signal) => $({ cwd: context.cwd, all: true, cancelSignal: signal })`${command} ${args ?? []}`,
      catch: (error) => error as ExecaError
    })),
    Effect.mapBoth({
      onSuccess: (result) => Output.Success({ 
        stdout: result.stdout.replace(/\\(.)/g, '$1'),
        exitCode: Option.fromNullable(result.exitCode)
      }),
      onFailure: (error) => Output.Failure({ 
        stderr: Option.fromNullable(error.stderr).pipe(
          Option.map((stderr) => stderr.toString()),
          Option.getOrElse(() => Str.empty)
        ), 
        exitCode: Option.fromNullable(error.exitCode) 
      })
    })
  ),
}));