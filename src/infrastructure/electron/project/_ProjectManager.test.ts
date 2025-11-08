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

	const mock = ProjectManagerCore.of({
		loadRecents: () => Effect.succeed(store),
		saveRecents: (_path, newRecents) => Effect.sync(() => {
      store = [...newRecents];
    }),
	});

	return { mock, getStore: () => store };
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

	it("should open a project and update recents", async () => {
    // Should instantiate first to use one singular instance.
    const projectManagerImpl = await Effect.runPromise(ProjectManager.pipe(
      Effect.provide(ProjectManagerLive),
      Effect.provide(ProjectManagerCoreLayer({ ...MockFileSystemState(), files: new Map<string, string>([[pkgPath, pkgContent]]) }))
    ));

    // Test open function.
    const opened = await Effect.runPromise(projectManagerImpl.open("/projects/demo"));

    expect(opened.name).toBe("demo-project");
    expect(opened.path).toBe("/projects/demo");

    // Test current function.
    const current = await Effect.runPromise(projectManagerImpl.getCurrent());

    expect(Option.isSome(current)).toBe(true);

    // Test recent function.
    const recents = await Effect.runPromise(projectManagerImpl.listRecents());

    expect(recents[0].name).toBe("demo-project");

    // Rest close function.
    const currentAfterClose = await Effect.runPromise(Effect.zipRight(
      projectManagerImpl.close(), 
      projectManagerImpl.getCurrent()
    ));

    expect(Option.isNone(currentAfterClose)).toBe(true);
  });

  it("should fail when package.json is missing", async () => {
    const result = Effect.runPromise(ProjectManager.pipe(
      Effect.provide(ProjectManagerLive),
      Effect.provide(ProjectManagerCoreLayer({ ...MockFileSystemState(), files: new Map<string, string>([[pkgPath, pkgContent]]) })),
      Effect.andThen(manager => manager.open("/invalid/path"))
    ));

    await expect(result).rejects.toThrow(Error);
  });

  it("should open a project with all fields in package.json", async () => {
    const pkgJson = JSON.stringify({
      name: "complete-project",
      dependencies: { react: "18.0.0" },
      devDependencies: { vitest: "1.0.0" },
    });

    const project = await Effect.runPromise(ProjectManager.pipe(
      Effect.provide(ProjectManagerLive),
      Effect.provide(ProjectManagerCoreLayer({ ...MockFileSystemState(), files: new Map<string, string>([[pkgPath, pkgJson]]) })),
      Effect.andThen(manager => manager.open('/projects/demo'))
    ));

    expect(project.name).toBe("complete-project");
    expect(project.dependencies).toHaveProperty("react");
  });

  it("should fall back to basename when name is missing", async () => {
    const pkgJson = JSON.stringify({});
    const project = await Effect.runPromise(ProjectManager.pipe(
      Effect.provide(ProjectManagerLive),
      Effect.provide(ProjectManagerCoreLayer({ ...MockFileSystemState(), files: new Map<string, string>([[pkgPath, pkgJson]]) })),
      Effect.andThen(manager => manager.open('/projects/demo'))
    ));

    expect(project.name).toBe("demo");
  });

  it("should default dependencies and devDependencies to empty objects", async () => {
    const pkgJson = JSON.stringify({ name: "no-deps" });
    const project = await Effect.runPromise(ProjectManager.pipe(
      Effect.provide(ProjectManagerLive),
      Effect.provide(ProjectManagerCoreLayer({ ...MockFileSystemState(), files: new Map<string, string>([[pkgPath, pkgJson]]) })),
      Effect.andThen(manager => manager.open('/projects/demo'))
    ));

    expect(project.dependencies).toEqual({});
    expect(project.devDependencies).toEqual({});
  });
});
