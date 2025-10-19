import { spawn } from "node:child_process";
import { CommandExecutor, Output } from "@core/execution";
import { Effect, Layer, Option } from "effect";

export const ShellExecutorLive = Layer.succeed(CommandExecutor, CommandExecutor.of({
  execute: (command, args, context = { cwd: process.cwd() }) => Effect.async<Output["Success"], Output["Failure"]>((resume) => {
    const child = spawn(command, args, {
      cwd: context.cwd,
      env: { ...process.env, ...context.env },
      shell: true,
    });

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    child.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    child.on("close", (exitCode) => {
      if (exitCode === 0) {
        resume(Effect.succeed(Output.Success({ stdout, exitCode: Option.fromNullable(exitCode) })));
      } else {
        resume(Effect.fail(Output.Failure({ stderr, exitCode: Option.fromNullable(exitCode) })));
      }
    });
  })
}))