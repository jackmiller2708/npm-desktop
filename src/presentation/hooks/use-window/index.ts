import { IPCService } from "@presentation/services/ipc";
import { Effect } from "effect";
import { WindowService } from "./_window.service";

export function useWindow() {
	return {
		showOpenDialog: () => WindowService.pipe(
      Effect.andThen((win) => win.showOpenDialog()),
      Effect.andThen(IPCService.Interceptors.transformResponseInterceptor()),
      Effect.either,
      Effect.provide(WindowService.Default)
    ),
    maximize: () => WindowService.pipe(
      Effect.andThen((win) => win.maximize()),
      Effect.andThen(IPCService.Interceptors.transformResponseInterceptor()),
      Effect.either,
      Effect.provide(WindowService.Default)
    ),
    unmaximize: () => WindowService.pipe(
      Effect.andThen((win) => win.unmaximize()),
      Effect.andThen(IPCService.Interceptors.transformResponseInterceptor()),
      Effect.either,
      Effect.provide(WindowService.Default)
    ),
    minimize: () => WindowService.pipe(
      Effect.andThen((win) => win.minimize()),
      Effect.andThen(IPCService.Interceptors.transformResponseInterceptor()),
      Effect.either,
      Effect.provide(WindowService.Default)
    ),
    close: () => WindowService.pipe(
      Effect.andThen((win) => win.close()),
      Effect.andThen(IPCService.Interceptors.transformResponseInterceptor()),
      Effect.either,
      Effect.provide(WindowService.Default)
    ),
	};
}
