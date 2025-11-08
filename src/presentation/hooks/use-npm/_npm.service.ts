import { IPCService } from "@presentation/services/ipc";
import { Effect } from "effect";

export class NpmService extends Effect.Service<NpmService>()("app/NpmService", {
	effect: Effect.Do.pipe(
		Effect.andThen(() => IPCService),
		Effect.map((ipc) => ({
      install: (pkg: string) => ipc.invoke("npm:install", pkg),
      list: () => ipc.invoke("npm:list"),
    }) as const),
	),
  dependencies: [IPCService.Default]
}) {}
