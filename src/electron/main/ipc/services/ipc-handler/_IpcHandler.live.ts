import type { HandlerRegistrar, IPCContractRegistry } from "@shared/types/registry";

import { Array as Collection, Effect, Function as Fn, Layer, Record } from "effect";
import { ipcMain } from "electron";
import { handlerRuntime } from "../../handlers/handler.runtime";
import { IpcHandlerService } from "./_IpcHandler.service";

export const IpcHandlerServiceLive = Layer.succeed(IpcHandlerService, IpcHandlerService.of({
  register: <Registry extends IPCContractRegistry>(registrar: HandlerRegistrar<Registry>) => Fn.pipe(
    Record.toEntries(registrar),
    Collection.flatMap(([ns, handler]) => handler.pipe(
      Effect.map(Record.toEntries),
      Effect.map(Collection.map(([command, fn]) => ([`${ns}:${command}`, fn] as const))),
      handlerRuntime.runSync
    )),
    Collection.map(([channel, handlerFn]) => Effect.Do.pipe(
      // biome-ignore lint/suspicious/noExplicitAny: for generic type inference.
      Effect.andThen(() => Effect.sync(() => ipcMain.handle(channel, (_, ...args) => Effect.runPromise(handlerFn(...args as any))))),
      Effect.tap(() => Effect.logInfo(`Registered handler for: ${channel}`))
    )),
    registerHandlerFNs => Effect.all(registerHandlerFNs, { concurrency: 'unbounded', discard: true })
  ),
}));