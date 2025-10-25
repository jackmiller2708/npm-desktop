import { IPCRegistry } from "@shared/ipc/registry";
import { HandlerRegistrarShape } from "@types";
import { Context, Effect } from "effect";

export class AppStarter extends Context.Tag("AppStarter")<AppStarter, {
  startup: () => Effect.Effect<void, Error, HandlerRegistrarShape<IPCRegistry>[keyof HandlerRegistrarShape<IPCRegistry>]>;
}>() {}
