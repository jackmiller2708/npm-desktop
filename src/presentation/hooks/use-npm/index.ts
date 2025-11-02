import { IPCService } from "@presentation/services/ipc";
import { Effect } from "effect";
import { NpmService } from "./_npm.service";

export function useNpm() {
	return {
		install: (pkg: string) => NpmService.pipe(
      Effect.andThen((service) => service.install(pkg)),
      Effect.andThen(IPCService.Interceptors.transformResponseInterceptor()),
      Effect.either,
      Effect.provide(NpmService.Default)
    ),
    list: () => NpmService.pipe(
      Effect.andThen((service) => service.list()),
      Effect.andThen(IPCService.Interceptors.transformResponseInterceptor()),
      Effect.either,
      Effect.provide(NpmService.Default)
    ),
	};
}
