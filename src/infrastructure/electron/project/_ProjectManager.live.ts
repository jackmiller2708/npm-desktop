import { ProjectManager, ProjectManagerCore } from "@core/project";
import { FileSystem } from "@effect/platform/FileSystem";
import { Path } from "@effect/platform/Path";
import { ENCODINGS } from "@shared/constants";
import { ProjectInfo } from "@shared/project";
import { Effect, Layer, Option, Ref, Schema } from "effect";

import os from "os";

export const ProjectManagerLive = Layer.effect(ProjectManager, Effect.Do.pipe(
  Effect.andThen(() => Effect.all([ProjectManagerCore, FileSystem, Path])),
  Effect.map(([{ loadRecents, saveRecents, loadLastOpen, saveLastOpen }, fs, path]) => {
    const MUT_CURRENT_REF = Effect.runSync(Ref.make<Option.Option<ProjectInfo>>(Option.none()));
    const RECENT_PROJECT_PATH = path.join(os.homedir(), import.meta.env.VITE_APP_DATA_DIR, import.meta.env.VITE_APP_RECENT_OPENS);

    return ProjectManager.of({
      open: (projectPath) => Effect.Do.pipe(
        Effect.map(() => path.join(projectPath, import.meta.env.VITE_PACKAGE_JSON)),
        Effect.andThen((pkgPath) => Effect.Do.pipe(
          Effect.andThen(() => fs.readFileString(pkgPath, ENCODINGS.UTF8)),
          Effect.map((pkgJson) => JSON.parse(pkgJson)),
          Effect.andThen((pkgInfo) => Schema.encodeSync(ProjectInfo)({
            path: projectPath,
            name: Option.fromNullable(pkgInfo.name).pipe(Option.getOrElse(() => path.basename(projectPath))),
            packageJsonPath: pkgPath,
            dependencies: Option.fromNullable(pkgInfo.dependencies).pipe(Option.getOrElse(() => ({}))),
            devDependencies: Option.fromNullable(pkgInfo.devDependencies).pipe(Option.getOrElse(() => ({}))),
            lastOpened: Date.now(),
          })),
          Effect.tap((project) => Effect.Do.pipe(
            Effect.andThen(() => Effect.zipRight(Effect.all([Ref.set(MUT_CURRENT_REF, Option.some(project)), saveLastOpen(RECENT_PROJECT_PATH, Option.some(project))], { concurrency: 'unbounded' }), loadRecents(RECENT_PROJECT_PATH))),
            Effect.andThen((recents) => saveRecents(RECENT_PROJECT_PATH, [project, ...recents.filter((p) => p.path !== project.path)].slice(0, 10))),
          ))
        ))
      ),
      close: () => Effect.zipRight(saveLastOpen(RECENT_PROJECT_PATH, Option.none()), Ref.set(MUT_CURRENT_REF, Option.none())),
      listRecents: () => loadRecents(RECENT_PROJECT_PATH),
      getCurrent: () => Ref.get(MUT_CURRENT_REF).pipe(Effect.andThen(Option.match({
        onSome: (current) => Effect.succeed(Option.some(current)),
        onNone: () => loadLastOpen(RECENT_PROJECT_PATH)
      }))),
    })
  }),
));
