import { ProjectManagerCore } from "@core/project";
import { BadArgument, SystemError } from "@effect/platform/Error";
import { FileSystem, Path } from "@effect/platform/index";
import { Effect, Layer, Option } from "effect/index";
import { describe, expect, it } from "vitest";
import { ProjectManagerCoreLive } from "./_ProjectManagerCore.live";

//#region Test Env Setup
interface MockFileSystemState {
  files: Map<string, string>;
  directories: Set<string>;
}

function MockFileSystemState(): MockFileSystemState {
  return {
    files: new Map(),
    directories: new Set(),
  }
}

function makeMockFileSystem(state = MockFileSystemState()){
  const fsImpl: Partial<FileSystem.FileSystem> = {
    readFileString: (path) => Option.fromNullable(state.files.get(path)).pipe(Option.match({
      onSome: (file) => Effect.succeed(file),
      onNone: () => Effect.fail(new BadArgument({ module: "FileSystem", method: "readFileString" }))
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

function MockFileSystem(state = MockFileSystemState()) {
  return FileSystem.layerNoop(makeMockFileSystem(state).fsImpl);
}

function TestProjectManagerCore(state = MockFileSystemState()) {
  return ProjectManagerCoreLive.pipe(
    Layer.provide(MockFileSystem(state)),
    Layer.provide(Path.layer)
  );
}
//#endregion

describe("ProjectManagerCore", () => {
	it("should create recents storage if missing and load empty array", async () => {
    const result =  await Effect.runPromise(ProjectManagerCore.pipe(
      Effect.andThen((core) => core.loadRecents("/recents.json")),
      Effect.provide(TestProjectManagerCore())
    ));

    expect(result).toEqual([]);
  });

  it("should handle parsing Error for invalid recents file content", async () => {
    const state = MockFileSystemState();
    const result = Effect.runPromise(ProjectManagerCore.pipe(
      Effect.andThen(core => Effect.Do.pipe(
        Effect.andThen(() => core.saveRecents("/recents.json", [{
          path: "/p1",
          name: "proj1",
          packageJsonPath: "/p1/package.json",
          dependencies: {},
          devDependencies: {},
          lastOpened: Date.now(),
        }])),
        Effect.tap(() => state.files.set("/recents.json", "[")),
        Effect.andThen(() => core.loadRecents("/recents.json"))
      )),
      Effect.provide(TestProjectManagerCore(state))
    ));

    await expect(result).rejects.toThrow(Error);
  })

	it("should save and load recents correctly", async () => {
    const result =  await Effect.runPromise(ProjectManagerCore.pipe(
      Effect.andThen(core => Effect.Do.pipe(
        Effect.andThen(() => core.saveRecents("/recents.json", [{
          path: "/p1",
          name: "proj1",
          packageJsonPath: "/p1/package.json",
          dependencies: {},
          devDependencies: {},
          lastOpened: Date.now(),
        }])),
        Effect.andThen(() => core.loadRecents("/recents.json"))
      )),
      Effect.provide(TestProjectManagerCore())
    ));

    expect(result[0].name).toBe("proj1");
  });

  it("should save lastOpen without overwriting recents", async () => {
    const state = MockFileSystemState();

    const result = await Effect.runPromise(
      ProjectManagerCore.pipe(
        Effect.andThen((core) => Effect.Do.pipe(
          // Step 1: Save recents
          Effect.andThen(() =>  core.saveRecents("/recents.json", [
            {
              path: "/p1",
              name: "proj1",
              packageJsonPath: "/p1/package.json",
              dependencies: {},
              devDependencies: {},
              lastOpened: Date.now(),
            },
          ])),
          // Step 2: Save last open separately
          Effect.andThen(() => core.saveLastOpen("/recents.json", Option.some({
            path: "/p2",
            name: "proj2",
            packageJsonPath: "/p2/package.json",
            dependencies: {},
            devDependencies: {},
            lastOpened: Date.now(),
          }))),
          // Step 3: Verify both fields exist
          Effect.andThen(() => core.loadRecents("/recents.json").pipe(
            Effect.zip(core.loadLastOpen("/recents.json"))
          ))
        )),
        Effect.provide(TestProjectManagerCore(state))
      )
    );

    const [recents, lastOpenOpt] = result;
    const lastOpen = Option.getOrUndefined(lastOpenOpt);

    expect(recents.length).toBe(1);
    expect(recents[0].name).toBe("proj1");
    expect(lastOpen?.name).toBe("proj2");


    const json = Option.fromNullable(state.files.get("/recents.json")).pipe(Option.match({
      onSome: str => JSON.parse(str),
      onNone: () => ({})
    }));

    expect(json.recents.length).toBe(1);
    expect(json.lastOpen.name).toBe("proj2");``
  });

  it("should return none if lastOpen is null", async () => {
    const state = MockFileSystemState();

    state.files.set("/recents.json", JSON.stringify({ recents: [], lastOpen: null }));

    const result = await Effect.runPromise(ProjectManagerCore.pipe(
      Effect.andThen((core) => core.loadLastOpen("/recents.json")),
      Effect.provide(TestProjectManagerCore(state))
    ));

    expect(Option.isNone(result)).toBe(true);
  });
});
