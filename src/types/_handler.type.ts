/** biome-ignore-all lint/suspicious/noExplicitAny: any is used for generic type inference */
import type { Context, Effect, ManagedRuntime } from "effect";
import type { ExtractInput, ExtractOutput, IPCContractRegistry } from "./_registry.type";

export type Handler<
  Registry extends IPCContractRegistry,
  NS extends keyof Registry & string,
> = {
  [K in keyof Registry[NS] & string]: (
    ...args: ExtractInput<Registry, `${NS}:${K}`>
  ) => Effect.Effect<ExtractOutput<Registry, `${NS}:${K}`>, Error>;
};

export type HandlerClass<
  Id extends string,
  Registry extends IPCContractRegistry,
  NS extends keyof Registry & string,
> = Context.Tag<Id, Handler<Registry, NS>>;

export type HandlerClassShape<
  Id extends string,
  Registry extends IPCContractRegistry,
  NS extends keyof Registry & string,
> = Context.TagClassShape<Id, Handler<Registry, NS>>;

export type HandlerRegistrar<Registry extends IPCContractRegistry = any> = {
  [NS in keyof Registry & string]: HandlerClass<any, Registry, NS>;
};

export type HandlerRegistrarShape<Registry extends IPCContractRegistry = any> = {
  [NS in keyof Registry & string]: HandlerClassShape<any, Registry, NS>;
};

export type HandlerRuntime<Registry extends IPCContractRegistry = any> = ManagedRuntime.ManagedRuntime<
  HandlerRegistrarShape<Registry>[keyof HandlerRegistrarShape<Registry>],
  never
>;