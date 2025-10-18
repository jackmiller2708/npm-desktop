import { Effect } from "effect/index";

export function useNpm() {
	return {
		install: (pkg: string) => Effect.tryPromise({
      try: () => window.ipc.invoke("npm:install", pkg),
      catch: (error) => error as Error,
    }),
	};
}
