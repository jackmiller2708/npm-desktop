import { ProjectManager, ProjectManagerCore } from "@core/project";
import { BadArgument, SystemError } from "@effect/platform/Error";
import { FileSystem, Path } from "@effect/platform/index";
import { ProjectInfo } from "@shared/project";
import { Effect, Layer, Option } from "effect/index";
import { describe, expect, it } from "vitest";
import { ProjectManagerLive } from "./_ProjectManager.live";

//#region Test Env Setup
interface MockFileSystemState {
	files: Map<string, string>;
	directories: Set<string>;
}

function MockFileSystemState(): MockFileSystemState {
	return { files: new Map(), directories: new Set() };
}

function makeFileSystemMock(state = MockFileSystemState()) {
	const fsImpl: Partial<FileSystem.FileSystem> = {
		readFileString: (path) => Option.fromNullable(state.files.get(path)).pipe(Option.match({
      onSome: (file) => Effect.succeed(file),
      onNone: () => Effect.fail( new BadArgument({ module: "FileSystem", method: "readFileString" })),
    })),

		writeFileString: (path, content) => Effect.sync(() => {
      state.files.set(path, content);
    }),

		access: (path) => state.files.has(path) || state.directories.has(path)
      ? Effect.void
      : Effect.fail(new SystemError({ module: "FileSystem", method: "access", reason: "PermissionDenied" })),

		makeDirectory: (path) => Effect.sync(() => {
      state.directories.add(path);
    }),
	};

	return { fsImpl, state };
}

function fileSystemMock(state = MockFileSystemState()) {
	return FileSystem.layerNoop(makeFileSystemMock(state).fsImpl);
}

function makeProjectManagerCoreMock(recents: ReadonlyArray<ProjectInfo> = []) {
  let store = [...recents];
  let lastOpen: Option.Option<ProjectInfo> = Option.none();

  const mock = ProjectManagerCore.of({
    loadRecents: () => Effect.succeed(store),
    saveRecents: (_path, newRecents) => Effect.sync(() => {
      store = [...newRecents];
    }),
    loadLastOpen: () => Effect.succeed(lastOpen),
    saveLastOpen: (_path, project) => Effect.sync(() => {
      lastOpen = project;
    }),
  });

  return { mock, getStore: () => store, getLastOpen: () => lastOpen };
}

function ProjectManagerCoreMock(recents: ReadonlyArray<ProjectInfo> = []) {
	return Layer.succeed(ProjectManagerCore, makeProjectManagerCoreMock(recents).mock);
}

function ProjectManagerCoreLayer(state = MockFileSystemState(), recents: ReadonlyArray<ProjectInfo> = []) {
	return Layer.mergeAll(ProjectManagerCoreMock(recents), fileSystemMock(state), Path.layer);
}
//#endregion

describe("ProjectManagerLive", () => {
	const pkgPath = "/projects/demo/package.json";
	const pkgContent = JSON.stringify({
		name: "demo-project",
		dependencies: { react: "^18.0.0" },
		devDependencies: { vite: "^5.0.0" },
	});

	it("should open a project, update recents and set lastOpen", async () => {
    const fsState = MockFileSystemState();
    fsState.files.set(pkgPath, pkgContent);

    const manager = await Effect.runPromise(ProjectManager.pipe(
      Effect.provide(ProjectManagerLive),
      Effect.provide(ProjectManagerCoreLayer(fsState))
    ));

    // Open a project
    const opened = await Effect.runPromise(manager.open("/projects/demo"));
    expect(opened.name).toBe("demo-project");
    expect(opened.path).toBe("/projects/demo");

    // getCurrent should return the same project
    const current = await Effect.runPromise(manager.getCurrent());
    expect(Option.isSome(current)).toBe(true);
    expect(Option.getOrUndefined(current)?.name).toBe("demo-project");

    // recents should include the opened project
    const recents = await Effect.runPromise(manager.listRecents());
    expect(recents[0].name).toBe("demo-project");

    // close should clear the current ref
    const currentAfterClose = await Effect.runPromise(
      Effect.zipRight(manager.close(), manager.getCurrent())
    );

    expect(Option.isNone(currentAfterClose)).toBe(true);
  });

  it("should retrieve last open project when current is none", async () => {
    const fsState = MockFileSystemState();
    const coreMock = makeProjectManagerCoreMock();

    fsState.files.set(pkgPath, pkgContent);

    const manager = await Effect.runPromise(ProjectManager.pipe(
      Effect.provide(ProjectManagerLive),
      Effect.provide(Layer.mergeAll(Layer.succeed(ProjectManagerCore, coreMock.mock), fileSystemMock(fsState), Path.layer))
    ));

    await Effect.runPromise(coreMock.mock.saveLastOpen("/recents.json", Option.some({
      path: "/projects/last",
      name: "last-project",
      packageJsonPath: "/projects/last/package.json",
      dependencies: {},
      devDependencies: {},
      lastOpened: Date.now(),
    })));

    const current = await Effect.runPromise(manager.getCurrent());

    expect(Option.isSome(current)).toBe(true);
    expect(Option.getOrUndefined(current)?.name).toBe("last-project");
  });

  it("should fail when package.json is missing", async () => {
    const result = Effect.runPromise(ProjectManager.pipe(
      Effect.provide(ProjectManagerLive),
      Effect.provide(ProjectManagerCoreLayer(MockFileSystemState())),
      Effect.andThen((manager) => manager.open("/invalid/path"))
    ));

    await expect(result).rejects.toThrow(Error);
  });

  it("should open a project with all fields from package.json", async () => {
    const fsState = MockFileSystemState();
    const pkgJson = JSON.stringify({
      name: "complete-project",
      dependencies: { react: "18.0.0" },
      devDependencies: { vitest: "1.0.0" },
    });

    fsState.files.set(pkgPath, pkgJson);

    const project = await Effect.runPromise(ProjectManager.pipe(
      Effect.provide(ProjectManagerLive),
      Effect.provide(ProjectManagerCoreLayer(fsState)),
      Effect.andThen((manager) => manager.open("/projects/demo"))
    ));

    expect(project.name).toBe("complete-project");
    expect(project.dependencies).toHaveProperty("react");
    expect(project.devDependencies).toHaveProperty("vitest");
  });

  it("should fall back to basename when name is missing", async () => {
    const pkgJson = JSON.stringify({});
    const fsState = MockFileSystemState();

    fsState.files.set(pkgPath, pkgJson);

    const project = await Effect.runPromise(ProjectManager.pipe(
      Effect.provide(ProjectManagerLive),
      Effect.provide(ProjectManagerCoreLayer(fsState)),
      Effect.andThen((manager) => manager.open("/projects/demo"))
    ));

    expect(project.name).toBe("demo");
  });

  it("should default dependencies and devDependencies to empty objects", async () => {
    const pkgJson = JSON.stringify({ name: "no-deps" });
    const fsState = MockFileSystemState();

    fsState.files.set(pkgPath, pkgJson);

    const project = await Effect.runPromise(ProjectManager.pipe(
      Effect.provide(ProjectManagerLive),
      Effect.provide(ProjectManagerCoreLayer(fsState)),
      Effect.andThen((manager) => manager.open("/projects/demo"))
    ));

    expect(project.dependencies).toEqual({});
    expect(project.devDependencies).toEqual({});
  });
});
