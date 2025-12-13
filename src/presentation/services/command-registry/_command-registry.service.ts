import { Effect, Logger, Option } from "effect/index";
import type { CommandHandler, CommandId, ICommandRegistryService } from "./_command-registry.interface";

export class CommandRegistryService extends Effect.Service<ICommandRegistryService>()("app/CommandRegistryService", 	{
  effect: Effect.Do.pipe(Effect.andThen(() => Effect.sync(() => {
    const registry = new Map<CommandId, CommandHandler>();

    return {
      register: (id: CommandId, handler: CommandHandler) => Effect.succeed(registry.set(id, handler)),
      execute: (id: CommandId, ...args: unknown[]) => Option.fromNullable(registry.get(id)).pipe(Option.match({
        onSome: (handler) => handler(args),
        onNone: () => Effect.Do.pipe(
          Effect.andThen(() => Effect.logWarning(`[menu] Command not registered: ${id}`)),
          Effect.provide(Logger.pretty)
        )
      }))
    } as ICommandRegistryService;
  }))),
}) {}
