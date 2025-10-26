import { CommandExecutor } from "@core/execution";
import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { ShellExecutorLive } from "./_ShellExecutor.live";

describe(`ExecaExecutor`, () => {
  it("should execute a simple command", async () => {
    const result = await Effect.runPromise(CommandExecutor.pipe(
      Effect.andThen(executor => executor.execute("node", ["-e", "console.log('hello')"])),
      Effect.provide(ShellExecutorLive)
    ));

    expect(result.stdout.trim()).toBe("hello");
  });

  it("should throw command errors", async () => {
    const result = Effect.runPromise(CommandExecutor.pipe(
      Effect.andThen(executor => executor.execute("invalid_command")),
      Effect.provide(ShellExecutorLive)
    ));

    await expect(result).rejects.toThrow();
  });
});
