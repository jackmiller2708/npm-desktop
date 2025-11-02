import { IPCService } from "@presentation/services/ipc";
import { Effect } from "effect/index";

export class NpmService extends Effect.Service<NpmService>()("app/Cache", {
	effect: Effect.Do.pipe(
		Effect.andThen(() => IPCService),
		Effect.map((ipc) => ({
      install: (pkg: string) => ipc.invoke("npm:install", pkg),
      list: () => ipc.invoke("npm:list"),
    }) as const),
	),
  dependencies: [IPCService.Default]
}) {}
