import { WindowHandler } from "@application/ipc/handlers";
import { Effect } from "effect";
import { describe, expect, it, vi } from "vitest";
import { WindowHandlerLive } from "./_WindowHandler.live";

vi.mock("electron", () => ({
	dialog: {
		showOpenDialog: vi
			.fn()
			.mockResolvedValueOnce({
				canceled: false,
				filePaths: ["/foo/bar.txt"],
			})
			.mockResolvedValueOnce({
				canceled: true,
				filePaths: [],
			})
      .mockRejectedValueOnce(new Error("Dialog failed")),
	},
	BrowserWindow: {
		getFocusedWindow: vi.fn().mockReturnValue({}),
	},
}));

describe("OpenDialogLive", () => {
	it("returns file paths when dialog resolves successfully", async () => {
    const { dialog } = await import("electron");

		const result = await Effect.runPromise(WindowHandler.pipe(
      Effect.andThen((win) => win.showOpenDialog()),
      Effect.provide(WindowHandlerLive),
    ));

		expect(dialog.showOpenDialog).toHaveBeenCalled();
		expect(result).toEqual(["/foo/bar.txt"]);
	});

	it("returns empty array when canceled", async () => {
    const { dialog } = await import("electron");

	  const result = await Effect.runPromise(WindowHandler.pipe(
      Effect.andThen((win) => win.showOpenDialog()),
      Effect.provide(WindowHandlerLive),
    ));

		expect(dialog.showOpenDialog).toHaveBeenCalled();
		expect(result).toEqual([]);
	});

	it("fails with Error when dialog rejects", async () => {
	  const result = Effect.runPromise(WindowHandler.pipe(
      Effect.andThen((win) => win.showOpenDialog()),
      Effect.provide(WindowHandlerLive),
    ));

	  await expect(result).rejects.toThrow("Dialog failed");
	});
});
