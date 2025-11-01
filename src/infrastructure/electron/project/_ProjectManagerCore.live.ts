import { ProjectManagerCore } from "@core/project";
import { FileSystem } from "@effect/platform/FileSystem";
import { Path } from "@effect/platform/Path";
import { ProjectInfo } from "@shared/project";
import { Array as Collection, Effect, Either, Layer, Schema } from "effect";

export const ProjectManagerCoreLive = Layer.effect(ProjectManagerCore, Effect.Do.pipe(
  Effect.andThen(() => Effect.all([FileSystem, Path])),
  Effect.map(([fs, path]) => {
    function _ensureStorage(filePath: string) {
      return Effect.Do.pipe(
        Effect.andThen(() => Effect.zipRight(fs.makeDirectory(path.dirname(filePath), { recursive: true }), fs.access(filePath))),
        Effect.either,
        Effect.andThen(Either.match({
          onRight: () => Effect.void,
          onLeft: () => fs.writeFileString(filePath, "[]")
        })),
      );
    }

    return ProjectManagerCore.of({
      loadRecents: (path) => _ensureStorage(path).pipe(
        Effect.andThen(() => fs.readFileString(path, "utf-8")),
        Effect.andThen((recentJson) =>  Effect.try({
          try: () => JSON.parse(recentJson) as ReadonlyArray<unknown>,
          catch: (e) => new Error(`Invalid JSON in recents file: ${(e as Error).message}`)
        })),
        Effect.map(Collection.map((item) => Schema.decodeUnknown(ProjectInfo)(item))),
        Effect.andThen((parsings) => Effect.all(parsings, { concurrency: 'unbounded' }))
      ),
      saveRecents: (path, recents) => _ensureStorage(path).pipe(
        Effect.andThen(() => fs.writeFileString(path, JSON.stringify(recents)))
      )
    })
  })
));
