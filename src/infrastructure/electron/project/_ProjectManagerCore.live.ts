import { ProjectManagerCore } from "@core/project";
import { FileSystem } from "@effect/platform/FileSystem";
import { Path } from "@effect/platform/Path";
import { ENCODINGS } from "@shared/constants";
import { ProjectInfo } from "@shared/project";
import { Array as Collection, Effect, Either, Layer, Option, Schema } from "effect";

interface Recents {
  recents: ReadonlyArray<ProjectInfo>;
  lastOpen: ProjectInfo |  null;
}

export const ProjectManagerCoreLive = Layer.effect(ProjectManagerCore, Effect.Do.pipe(
  Effect.andThen(() => Effect.all([FileSystem, Path])),
  Effect.map(([fs, path]) => {
    function _ensureStorage(filePath: string) {
      return Effect.Do.pipe(
        Effect.andThen(() => Effect.zipRight(fs.makeDirectory(path.dirname(filePath), { recursive: true }), fs.access(filePath))),
        Effect.either,
        Effect.andThen(Either.match({
          onRight: () => Effect.void,
          onLeft: () => fs.writeFileString(filePath, JSON.stringify({ recents: [], lastOpen: null }))
        })),
      );
    }

    function _readRecents(filePath: string): Effect.Effect<Recents, Error> {
      return _ensureStorage(filePath).pipe(
        Effect.andThen(() => fs.readFileString(filePath, ENCODINGS.UTF8)),
        Effect.flatMap((recentJson) =>
          Effect.try({
            try: () => JSON.parse(recentJson) as Recents,
            catch: (e) =>
              new Error(`Invalid JSON in recents file: ${(e as Error).message}`),
          })
        )
      );
    }

    function _writeRecents(filePath: string, recents: Recents) {
      return fs.writeFileString(filePath, JSON.stringify(recents, null, 2));
    }

    return ProjectManagerCore.of({
      loadRecents: (path) => _readRecents(path).pipe(
        Effect.map(({ recents }) => recents),
        Effect.map(Collection.map((item) => Schema.decodeUnknown(ProjectInfo)(item))),
        Effect.andThen((parsings) => Effect.all(parsings, { concurrency: "unbounded" }))
      ),
      saveRecents: (path, recents) => _readRecents(path).pipe(
        Effect.map((data) => ({ ...data, recents })),
        Effect.flatMap((updated) => _writeRecents(path, updated))
      ),
      saveLastOpen: (path, lastOpen) => _readRecents(path).pipe(
        Effect.map((data) => ({ ...data, lastOpen: Option.getOrNull(lastOpen) })),
        Effect.flatMap((updated) => _writeRecents(path, updated))
      ),
      loadLastOpen: (path) => _readRecents(path).pipe(
        Effect.map(({ lastOpen }) => Option.fromNullable(lastOpen))
      ),
    })
  })
));
