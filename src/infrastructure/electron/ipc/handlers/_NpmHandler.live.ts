import { NpmHandler } from "@application/ipc/handlers";
import { CommandExecutor } from "@core/execution";
import { Effect, Layer } from "effect";

export const NpmHandlerLive = Layer.effect(NpmHandler, Effect.Do.pipe(
  Effect.andThen(() => Effect.all([CommandExecutor])),
  Effect.andThen(([cmd]) => NpmHandler.of({
    install: (...args: string[]) => cmd.execute("npm", ["install", ...args]).pipe(Effect.mapBoth({
      onSuccess: (result) => result.stdout,
      onFailure: (error) => new Error(error.stderr)
    })),
    list: ({ json } = { json: false }) => cmd.execute("npm", ["list", json ? "--json" : ""]).pipe(Effect.mapBoth({
      onSuccess: (result) => result.stdout,
      onFailure: (error) => new Error(error.stderr)
    })),
  }))
));

