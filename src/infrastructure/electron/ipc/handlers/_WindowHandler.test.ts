import { WindowHandler } from "@application/ipc/window";
import { Effect } from "effect";
import { BrowserWindow, dialog } from "electron";
import { beforeEach, describe, expect, it, Mock, vi } from "vitest";
import { WindowHandlerLive } from "./_WindowHandler.live";

vi.mock("electron", () => ({
  dialog: {
    showOpenDialog: vi.fn(),
  },
  BrowserWindow: {
    getFocusedWindow: vi.fn(),
  },
}));

describe("OpenDialogLive", () => {
	beforeEach(() => {
    vi.clearAllMocks();
  });

	describe("showOpenDialog", () => {
		beforeEach(() => {
			const getFocusedWindow = BrowserWindow.getFocusedWindow as Mock;

			vi.resetModules();
			getFocusedWindow.mockReturnValue({});
		});

		it("returns file paths when dialog resolves successfully", async () => {
			(dialog.showOpenDialog as Mock).mockResolvedValueOnce({
				canceled: false,
				filePaths: ["/foo/bar.txt"],
			});

			const result = await Effect.runPromise(WindowHandler.pipe(
				Effect.andThen((win) => win.showOpenDialog()),
				Effect.provide(WindowHandlerLive),
			));

			expect(dialog.showOpenDialog).toHaveBeenCalledOnce();
			expect(result).toEqual(["/foo/bar.txt"]);
		});

		it("returns empty array when canceled", async () => {
			(dialog.showOpenDialog as Mock).mockResolvedValueOnce({
				canceled: true,
				filePaths: [],
			});

			const result = await Effect.runPromise(WindowHandler.pipe(
				Effect.andThen((win) => win.showOpenDialog()),
				Effect.provide(WindowHandlerLive),
			));

			expect(dialog.showOpenDialog).toHaveBeenCalledOnce();
			expect(result).toEqual([]);
		});

		it("fails with Error when dialog rejects", async () => {
			(dialog.showOpenDialog as Mock).mockRejectedValueOnce(new Error("Dialog failed"));

			const result = Effect.runPromise(WindowHandler.pipe(
				Effect.andThen((win) => win.showOpenDialog()),
				Effect.provide(WindowHandlerLive),
			));

			await expect(result).rejects.toThrow("Dialog failed");
		});
	});
	
	describe("window control actions", () => {
    it("calls minimize when window exists", async () => {
			const mockMinimize = vi.fn();
      (BrowserWindow.getFocusedWindow as Mock).mockReturnValue({ minimize: mockMinimize });

      await Effect.runPromise(WindowHandler.pipe(
				Effect.andThen((win) => win.minimize()),
				Effect.provide(WindowHandlerLive)
			));

      expect(mockMinimize).toHaveBeenCalled();
    });

    it("calls maximize when window exists", async () => {
			const mockMaximize = vi.fn();
      (BrowserWindow.getFocusedWindow as Mock).mockReturnValue({ maximize: mockMaximize });

      await Effect.runPromise(WindowHandler.pipe(
				Effect.andThen((win) => win.maximize()),
				Effect.provide(WindowHandlerLive)
			));

      expect(mockMaximize).toHaveBeenCalled();
    });

    it("calls unmaximize when window exists", async () => {
			const mockUnmaximize = vi.fn();
      (BrowserWindow.getFocusedWindow as Mock).mockReturnValue({ unmaximize: mockUnmaximize });

      await Effect.runPromise(WindowHandler.pipe(
				Effect.andThen((win) => win.unmaximize()),
				Effect.provide(WindowHandlerLive)
			));

      expect(mockUnmaximize).toHaveBeenCalled();
    });

    it("calls close when window exists", async () => {
			const mockClose = vi.fn();
      (BrowserWindow.getFocusedWindow as Mock).mockReturnValue({ close: mockClose });

      await Effect.runPromise(WindowHandler.pipe(
				Effect.andThen((win) => win.close()),
				Effect.provide(WindowHandlerLive)
			));

      expect(mockClose).toHaveBeenCalled();
    });

    it("skips actions silently if no focused window", async () => {
      (BrowserWindow.getFocusedWindow as Mock).mockReturnValue(null);

			const result = Effect.runPromise(WindowHandler.pipe(
				Effect.andThen((win) => win.minimize()),
				Effect.provide(WindowHandlerLive)
			));

      // Should not throw even if no window is found
      await expect(result).resolves.not.toThrow();
    });
  });
});
