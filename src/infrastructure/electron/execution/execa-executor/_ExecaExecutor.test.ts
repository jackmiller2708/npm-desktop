import { CommandExecutor } from "@core/execution";
import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { ExecaExecutorLive } from "./_ExecaExecutor.live";

describe(`ExecaExecutor`, () => {
  it("should execute a simple command", async () => {
    const result = await Effect.runPromise(CommandExecutor.pipe(
      Effect.andThen(executor => executor.execute("echo", ["hello"])),
      Effect.provide(ExecaExecutorLive)
    ));      

    expect(result.stdout.trim()).toBe('"hello"');
  });

  it("should handle command errors", async () => {
    const result = Effect.runPromise(CommandExecutor.pipe(
      Effect.andThen(executor => executor.execute("invalid_command")),
      Effect.provide(ExecaExecutorLive)
    )); 

    expect(result).rejects.toThrow();
  });
});