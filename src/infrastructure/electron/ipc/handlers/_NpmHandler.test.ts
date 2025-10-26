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

const NpmHandlerSuccessLive = Layer.provide(NpmHandlerLive, CommandExecutorNpmSuccessMockLive);

const CommandExecutorNpmErrorMockLive = Layer.succeed(CommandExecutor, CommandExecutor.of({
  execute: (_command, _args, _context) => Effect.fail(Output.Failure({
    stderr: 'Wrong command',
    exitCode: Option.none()
  })),
}));

const NpmHandlerErrorLive = Layer.provide(NpmHandlerLive, CommandExecutorNpmErrorMockLive);

describe("NpmHandler", () => {
  it("calls CommandExecutor with correct arguments (install, lodash)", async () => {
    const output = await Effect.runPromise(NpmHandler.pipe(
      Effect.andThen((npm) => npm.install("lodash")),
      Effect.provide(NpmHandlerSuccessLive)
    ));

    expect(output).toContain("lodash");
  });

  it("handles CommandExecutor Error gracefully", async () => {
    const output = Effect.runPromise(NpmHandler.pipe(
      Effect.andThen((npm) => npm.install("lodash")),
      Effect.provide(NpmHandlerErrorLive)
    ));

    await expect(output).rejects.toThrow();
  });

  it("calls list with no arguments", async () => {
    const output = await Effect.runPromise(NpmHandler.pipe(
      Effect.andThen((npm) => npm.list()),
      Effect.provide(NpmHandlerSuccessLive)
    ));

    expect(output).toContain("list");
  });

  it("calls list with json flag", async () => {
    const output = await Effect.runPromise(NpmHandler.pipe(
      Effect.andThen((npm) => npm.list({ json: true })),
      Effect.provide(NpmHandlerSuccessLive)
    ));

    expect(output).toContain("list --json");
  });

  it("handles list Error gracefully", async () => {
    const output = Effect.runPromise(NpmHandler.pipe(
      Effect.andThen((npm) => npm.list()),
      Effect.provide(NpmHandlerErrorLive)
    ));

    await expect(output).rejects.toThrow();
  });
});
