/** biome-ignore-all lint/suspicious/noExplicitAny: any is used for generic type inference */
import type { Context, Effect, Record } from "effect";
import type { ExtractInput, ExtractOutput, IPCCommandContract, IPCContractRegistry } from "./_registry.type";

export type Handler<
  Registry extends IPCContractRegistry,
  NS extends keyof Registry & string,
> = {
  [K in keyof Registry[NS] & string]: (...args: ExtractInput<Registry, `${NS}:${K}`>) => Effect.Effect<ExtractOutput<Registry, `${NS}:${K}`>, Error>;
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

export type RuntimeDependencies<Registry extends IPCContractRegistry = any> = HandlerRegistrarShape<Registry>[keyof HandlerRegistrarShape<Registry>];

export type NamespaceHandler<Namespace extends Record.ReadonlyRecord<string, IPCCommandContract>> = {
  [K in keyof Namespace & string]: (...args: ReadonlyArray<Namespace[K]["input"]>) => Effect.Effect<Namespace[K]["output"], Error>;
}