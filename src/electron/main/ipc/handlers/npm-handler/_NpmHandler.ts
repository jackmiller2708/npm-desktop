import { IPCRegistry } from "@shared/ipc/registry";
import type { Handler } from "@shared/types/registry";
import { Context, Effect, Layer } from "effect";

export class NpmHandler extends Context.Tag("NpmHandler")<NpmHandler, Handler<IPCRegistry, "npm">>() {}

export const NpmHandlerLive = Layer.succeed(NpmHandler, NpmHandler.of({
  install: (...args: string[]) => {
    console.log(`Installing ${args}`);
    return Effect.fail(new Error("This a test error to see how it throws"));
  },
}));