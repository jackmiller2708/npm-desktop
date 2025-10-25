import { NpmHandler } from "@application/ipc/handlers";
import { CommandExecutor, Output } from "@core/execution";
import { Array as Collection, Effect, Layer, Option, String as Str } from "effect";
import { describe, expect, it } from "vitest";
import { NpmHandlerLive } from "./_NpmHandler.live";

const CommandExecutorNpmSuccessMockLive = Layer.succeed(CommandExecutor, CommandExecutor.of({
  execute: (command, args, _context) => Effect.succeed(Output.Success({
    stdout: Str.trim(`Executed: ${command} ${Option.fromNullable(args).pipe(Option.map(Collection.join(" ")), Option.getOrElse(() => ""))}`),
    exitCode: Option.none()
  })),
}));

const CommandExecutorNpmErrorMockLive = Layer.succeed(CommandExecutor, CommandExecutor.of({
  execute: (_command, _args, _context) => Effect.fail(Output.Failure({
    stderr: 'Wrong command',
    exitCode: Option.none()
  })),
}));

describe("NpmHandler", () => {
  it("calls CommandExecutor with correct arguments", async () => {
    const output = await Effect.runPromise(NpmHandler.pipe(
      Effect.andThen((npm) => npm.install("lodash")),
      Effect.provide(Layer.provide(NpmHandlerLive, CommandExecutorNpmSuccessMockLive))
    ));

    expect(output).toContain("lodash");
  });

  it("handles CommandExecutor Error gracefully", async () => {
    const output = Effect.runPromise(NpmHandler.pipe(
      Effect.andThen((npm) => npm.install("lodash")),
      Effect.provide(Layer.provide(NpmHandlerLive, CommandExecutorNpmErrorMockLive))
    ));

    await expect(output).rejects.toThrow();
  });
});