import { IpcRegistrar } from "@core/ipc";
import { Response } from "@shared/ipc/response";
import type { NamespaceHandler } from "@types";
import { Context, Effect, Layer, ManagedRuntime, Record, Schema } from "effect";
import type { IpcMainInvokeEvent } from "electron";
import { ipcMain } from "electron";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { IpcRegistrarLive } from "./_IpcRegistrar.live";

//#region Test Env Setup
const NpmNamespaceMock = Schema.Struct({
	install: Schema.Struct({
		input: Schema.String,
		output: Schema.String,
	}),
});

const IPCRegistryMock = Schema.Struct({
	npm: NpmNamespaceMock,
});

class NpmHandlerMock extends Context.Tag("MockNamespace")<
	NpmHandlerMock,
	NamespaceHandler<Schema.Schema.Type<typeof NpmNamespaceMock>>
>() {}


// biome-ignore lint/suspicious/noExplicitAny: for type inference.
let registrar: Record.ReadonlyRecord<string, (event: IpcMainInvokeEvent, ...args: any[]) => Promise<any> | any>;

vi.mock("electron", () => ({
	ipcMain: {
		// biome-ignore lint/suspicious/noExplicitAny: for type inference.
		handle: vi.fn((channel: string, listener: (event: IpcMainInvokeEvent, ...args: any[]) => Promise<any> | any,) => {
      registrar = Record.set(registrar, channel, listener);
    }),
	},
}));
//#endregion

describe("IpcRegistrar", () => {
	beforeEach(() => {
		registrar = {};
		vi.resetAllMocks();
	});

	it("registers IPC handlers for each namespace:command", async () => {
		const ipcRuntimeSuccessMock = ManagedRuntime.make(Layer.merge(
      Layer.succeed(NpmHandlerMock, NpmHandlerMock.of({ install: (...args: string[]) => Effect.succeed(`installed ${args.join(" ")}`) })),
      IpcRegistrarLive,
    ));

		await ipcRuntimeSuccessMock.runPromise(IpcRegistrar.pipe(Effect.andThen((ipcRegistrar) =>
      ipcRegistrar.register<Schema.Schema.Type<typeof IPCRegistryMock>>({ npm: NpmHandlerMock }),
    )));

		// Verify ipcMain.handle called
		expect(ipcMain.handle).toHaveBeenCalledTimes(1);
		expect(ipcMain.handle).toHaveBeenCalledWith("npm:install", expect.any(Function));

		// Test the registered function’s behavior
		await expect(registrar["npm:install"]({} as IpcMainInvokeEvent, "lodash")).resolves.toEqual(Response.Success({ data: "installed lodash" }));
	});

	it("handles IPC handler Error gracefully", async () => {
		const ipcRuntimeFailMock = ManagedRuntime.make(Layer.merge(
      Layer.succeed(NpmHandlerMock, NpmHandlerMock.of({ install: (..._args: string[]) => Effect.fail(new Error("Doesn't work")) })),
      IpcRegistrarLive,
    ));

		await ipcRuntimeFailMock.runPromise(IpcRegistrar.pipe(Effect.andThen((ipcRegistrar) =>
      ipcRegistrar.register<Schema.Schema.Type<typeof IPCRegistryMock>>({ npm: NpmHandlerMock }),
    )));

		// Verify ipcMain.handle called
		expect(ipcMain.handle).toHaveBeenCalledTimes(1);
		expect(ipcMain.handle).toHaveBeenCalledWith("npm:install", expect.any(Function));

		// Test the registered function’s behavior
		await expect(registrar["npm:install"]({} as IpcMainInvokeEvent, "lodash")).resolves.toEqual(Response.Failure({ reason: "Doesn't work" }));
	});
});
