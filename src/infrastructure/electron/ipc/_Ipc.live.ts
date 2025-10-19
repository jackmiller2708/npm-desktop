import { IpcRegistrar } from "@core/ipc";
import { Response } from "@shared/ipc/response";

import type { HandlerRegistrar, IPCContractRegistry } from "@types";

import { Array as Collection, Effect, Function as Fn, Layer, Record } from "effect";
import { ipcMain } from "electron";
import { ipcRuntime } from "./_Ipc.runtime";

export const IpcRegistrarLive = Layer.succeed(IpcRegistrar, IpcRegistrar.of({
  register: <Registry extends IPCContractRegistry>(registrar: HandlerRegistrar<Registry>) => Fn.pipe(
    Record.toEntries(registrar),
    Collection.flatMap(([ns, handler]) => handler.pipe(
      Effect.map(Record.toEntries),
      Effect.map(Collection.map(([command, fn]) => ([`${ns}:${command}`, fn] as const))),
      ipcRuntime.runSync
    )),
    Collection.map(([channel, handlerFn]) => Effect.Do.pipe(
      Effect.andThen(() => Effect.sync(() => ipcMain.handle(channel, (_, ...args) => Effect.runPromise(
        // biome-ignore lint/suspicious/noExplicitAny: for generic type inference.
        handlerFn(...args as any).pipe(Effect.match({
          onSuccess: (data) => Response.Success({ data }),
          onFailure: (error) => Response.Failure({ reason: error.message })
        }))
      )))),
      Effect.tap(() => Effect.logInfo(`Registered handler for: ${channel}`))
    )),
    registerHandlerFNs => Effect.all(registerHandlerFNs, { concurrency: 'unbounded', discard: true })
  ),
}));