import { NpmHandler } from "@core/npm";
import { Effect, Layer } from "effect";

export const NpmHandlerLive = Layer.succeed(NpmHandler, NpmHandler.of({
  install: (...args: string[]) => {
    console.log(`Installing ${args}`);
    return Effect.fail(new Error("This a test error to see how it throws"));
  },
}));