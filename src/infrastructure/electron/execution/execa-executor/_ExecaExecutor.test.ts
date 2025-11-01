import { CommandExecutor } from "@core/execution";
import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { ExecaExecutorLive } from "./_ExecaExecutor.live";

describe(`ExecaExecutor`, () => {
  it("should execute a simple command", async () => {
    const result = await Effect.runPromise(CommandExecutor.pipe(
      Effect.andThen(executor => executor.execute("node", ["-e", "console.log('hello')"])),
      Effect.provide(ExecaExecutorLive)
    ));

    expect(result.stdout.trim()).toBe("hello");
  });

  it("should execute a command with multiple arguments", async () => {
    const result = await Effect.runPromise(CommandExecutor.pipe(
      Effect.andThen(executor => executor.execute("node", ["-e", "console.log(process.argv.slice(2))", "arg1", "arg2", "arg3"])),
      Effect.provide(ExecaExecutorLive)
    ));

    expect(result.stdout.trim()).toBe("[ 'arg2', 'arg3' ]");
  })

  it("should throw command errors", async () => {
    const result = Effect.runPromise(CommandExecutor.pipe(
      Effect.andThen(executor => executor.execute("invalid_command")),
      Effect.provide(ExecaExecutorLive)
    ));

    await expect(result).rejects.toThrow();
  });
});