import { Context, Effect } from "effect";

export class AppStarter extends Context.Tag("AppStarter")<AppStarter, {
  startup: () => Effect.Effect<void, Error>;
}>() {}
