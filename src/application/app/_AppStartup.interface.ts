import { IPCRegistry } from "@shared/ipc/registry";
import { RuntimeDependencies } from "@types";
import { Context, Effect } from "effect";

export class AppStarter extends Context.Tag("AppStarter")<AppStarter, {
  startup: () => Effect.Effect<void, Error, RuntimeDependencies<IPCRegistry>>;
}>() {}
