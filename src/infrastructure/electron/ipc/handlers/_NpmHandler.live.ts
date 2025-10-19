import { NpmHandler } from "@application/ipc/handlers/npm";
import { CommandExecutor } from "@core/execution";
import { Effect, Layer } from "effect";

export const NpmHandlerLive = Layer.effect(NpmHandler, Effect.Do.pipe(
  Effect.andThen(() => Effect.all([CommandExecutor])),
  Effect.andThen(([cmd]) => NpmHandler.of({
    install: (...args: string[]) => {
      cmd.execute("npm", ["install", args.join(" ")]).pipe(
        Effect.andThen(result => result.stdout)
      )

      console.log(`Installing ${args}`);
      return Effect.fail(new Error("This a test error to see how it throws"));
    },
  }))
));