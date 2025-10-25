import { NpmHandler } from "@application/ipc/handlers";
import { IpcRegistrar } from "@core/ipc";
import { Response } from "@shared/ipc/response";
import { Effect, Layer, ManagedRuntime, Record, Schema } from "effect";

import type { IpcMainInvokeEvent } from "electron";

import { ipcMain } from "electron";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { IpcRegistrarLive } from "./_IpcRegistrar.live";

const MockRegistry = Schema.Struct({
	npm: Schema.Struct({
		install: Schema.Struct({
			input: Schema.String,
			output: Schema.String,
		}),
		list: Schema.Struct({
			input: Schema.Struct({
				json: Schema.Boolean,
			}),
			output: Schema.String,
		}),
	}),
});

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

describe("IpcRegistrar", () => {
	beforeEach(() => {
		registrar = {};
		vi.resetAllMocks();
	});

	it("registers IPC handlers for each namespace:command", async () => {
		const ipcRuntimeSuccessMock = ManagedRuntime.make(Layer.merge(
      Layer.succeed(NpmHandler, NpmHandler.of({
        install: (...args: string[]) => Effect.succeed(`installed ${args.join(" ")}`),
        list: () => Effect.succeed("")
      })),
      IpcRegistrarLive,
    ));

		await ipcRuntimeSuccessMock.runPromise(IpcRegistrar.pipe(Effect.andThen((ipcRegistrar) => 
      ipcRegistrar.register<Schema.Schema.Type<typeof MockRegistry>>({ npm: NpmHandler }),
    )));

		// Verify ipcMain.handle called
		expect(ipcMain.handle).toHaveBeenCalledTimes(2);
		expect(ipcMain.handle).toHaveBeenCalledWith("npm:install", expect.any(Function));

		// Test the registered function’s behavior
		await expect(registrar["npm:install"]({} as IpcMainInvokeEvent, "lodash")).resolves.toEqual(Response.Success({ data: "installed lodash" }));
	});

	it("handles IPC handler Error gracefully", async () => {
		const ipcRuntimeFailMock = ManagedRuntime.make(Layer.merge(
      Layer.succeed(NpmHandler, NpmHandler.of({
        install: (..._args: string[]) => Effect.fail(new Error("Doesn't work")),
        list: () => Effect.succeed("")
      })),
      IpcRegistrarLive,
    ));

		await ipcRuntimeFailMock.runPromise(IpcRegistrar.pipe(Effect.andThen((ipcRegistrar) =>
      ipcRegistrar.register<Schema.Schema.Type<typeof MockRegistry>>({ npm: NpmHandler }),
    )));

		// Verify ipcMain.handle called
		expect(ipcMain.handle).toHaveBeenCalledTimes(2);
		expect(ipcMain.handle).toHaveBeenCalledWith("npm:install", expect.any(Function));

		// Test the registered function’s behavior
		await expect(registrar["npm:install"]({} as IpcMainInvokeEvent, "lodash")).resolves.toEqual(Response.Failure({ reason: "Doesn't work" }));
	});
});
