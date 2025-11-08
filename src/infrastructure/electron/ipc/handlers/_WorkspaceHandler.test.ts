import { WorkspaceHandler } from "@application/ipc/workspace";
import { ProjectManager } from "@core/project";
import { ProjectInfo } from "@shared/project";
import { Effect, Layer, Option, Schema } from "effect";
import { describe, expect, it, vi } from "vitest";
import { WorkspaceHandlerLive } from "./_WorkspaceHandler.live";

//#region Mock Setup
function makeProjectManagerMock() {
	const open = vi.fn((path: string) => Effect.succeed(Schema.encodeSync(ProjectInfo)({
    name: "mock-project",
    path,
    dependencies: {},
    devDependencies: {},
    lastOpened: Date.now(),
    packageJsonPath: "",
  })));
	const getCurrent = vi.fn(() => Effect.succeed(Option.some(Schema.encodeSync(ProjectInfo)({
    name: "mock-project",
    path: "/mock/path",
    dependencies: {},
    devDependencies: {},
    lastOpened: Date.now(),
    packageJsonPath: "",
  }))));
	const getCurrentNone = vi.fn(() => Effect.succeed(Option.none()));
	const listRecents = vi.fn(() => Effect.succeed([
    Schema.encodeSync(ProjectInfo)({
      name: "recent-1",
      path: "/mock/path",
      dependencies: {},
      devDependencies: {},
      lastOpened: Date.now(),
      packageJsonPath: "",
    }),
  ]));
	const close = vi.fn(() => Effect.void);

	return {
		mock: ProjectManager.of({ open, getCurrent, listRecents, close, }),
		open,
		getCurrent,
		getCurrentNone,
		listRecents,
		close,
	};
}

function ProjectManagerMockLayer(mock: ReturnType<typeof ProjectManager.of>) {
	return Layer.succeed(ProjectManager, mock);
}
//#endregion

describe("WorkspaceHandlerLive", () => {
	it("should delegate open() to ProjectManager", async () => {
		const { mock, open } = makeProjectManagerMock();

		const result = await Effect.runPromise(WorkspaceHandler.pipe(
      Effect.andThen(wp => wp.open("/mock/path")),
      Effect.provide(WorkspaceHandlerLive),
      Effect.provide(ProjectManagerMockLayer(mock)),
    ));

		expect(result.name).toBe("mock-project");
		expect(open).toHaveBeenCalledWith("/mock/path");
	});

	it("should delegate getRecents() to ProjectManager", async () => {
		const { mock, listRecents } = makeProjectManagerMock();

		const recents = await Effect.runPromise(WorkspaceHandler.pipe(
      Effect.andThen(wp => wp.getRecents()),
      Effect.provide(WorkspaceHandlerLive),
      Effect.provide(ProjectManagerMockLayer(mock)),
    ));

		expect(listRecents).toHaveBeenCalledTimes(1);
		expect(recents).toHaveLength(1);
		expect(recents[0].name).toBe("recent-1");
	});

	it("should return the current project when available", async () => {
		const { mock } = makeProjectManagerMock();

		const project = await Effect.runPromise(WorkspaceHandler.pipe(
      Effect.andThen(wp => wp.getCurrent()),
      Effect.provide(WorkspaceHandlerLive),
      Effect.provide(ProjectManagerMockLayer(mock)),
    ));

		expect(project.name).toBe("mock-project");
	});

	it("should fail when getCurrent() returns none", async () => {
		const { mock, getCurrentNone } = makeProjectManagerMock();

		const result = Effect.runPromise(WorkspaceHandler.pipe(
      Effect.andThen(wp => wp.getCurrent()),
      Effect.provide(WorkspaceHandlerLive),
      Effect.provide(ProjectManagerMockLayer(ProjectManager.of({
        ...mock,
        getCurrent: getCurrentNone,
      }))),
    ));

		await expect(result).rejects.toThrow("No project is currently open");
	});

	it("should delegate close() to ProjectManager", async () => {
		const { mock, close } = makeProjectManagerMock();

		await Effect.runPromise(WorkspaceHandler.pipe(
      Effect.andThen(wp => wp.close()),
      Effect.provide(WorkspaceHandlerLive),
      Effect.provide(ProjectManagerMockLayer(mock)),
    ));

		expect(close).toHaveBeenCalledTimes(1);
	});
});
