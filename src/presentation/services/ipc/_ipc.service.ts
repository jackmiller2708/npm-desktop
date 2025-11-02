import { IPCRegistry } from "@shared/ipc/registry";
import { RemoteData } from "@shared/ipc/response";
import { ExtractCommand, ExtractInput, ExtractOutput } from "@types";
import { Effect, Match } from "effect";

interface IIPCService {
	invoke: <Cmd extends ExtractCommand<IPCRegistry>>(channel: Cmd, ...args: ExtractInput<IPCRegistry, Cmd>) => Effect.Effect<RemoteData<ExtractOutput<IPCRegistry, Cmd>, string>>;
}

export class IPCService extends Effect.Service<IPCService>()("app/Cache", {
	effect: Effect.sync(() => ({
    invoke: <Cmd extends ExtractCommand<IPCRegistry>>(channel: Cmd, ...args: ExtractInput<IPCRegistry, Cmd>) => (
      Effect.promise(() => window.ipc.invoke(channel, ...args))
    ),
  }) as IIPCService),
}) {
	static Interceptors = {
		transformResponseInterceptor: () => <T>(res: RemoteData<T, string>) => Match.value(res).pipe(
      Match.tag("Success", ({ data }) => Effect.succeed(data)),
      Match.tag("Failure", ({ reason }) => Effect.fail(new Error(reason))),
      Match.exhaustive,
    ),
	};
}