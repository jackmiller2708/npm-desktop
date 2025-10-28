import { ProjectManager, ProjectManagerCore } from "@core/project";
import { FileSystem } from "@effect/platform/FileSystem";
import { Path } from "@effect/platform/Path";
import { ProjectInfo } from "@shared/project";
import { Effect, Layer, Option, Ref, Schema } from "effect";

import os from "os";

export const ProjectManagerLive = Layer.effect(ProjectManager, Effect.Do.pipe(
  Effect.andThen(() => Effect.all([ProjectManagerCore, FileSystem, Path])),
  Effect.map(([{ loadRecents, saveRecents }, fs, path]) => {
    const CURRENT_REF = Effect.runSync(Ref.make<Option.Option<ProjectInfo>>(Option.none()));
    const RECENT_PROJECT_PATH = path.join(os.homedir(), ".npm-desktop", "recent-projects.json");

    return ProjectManager.of({
      open: (projectPath) => Effect.Do.pipe(
        Effect.map(() => path.join(projectPath, "package.json")),
        Effect.andThen((pkgPath) => Effect.Do.pipe(
          Effect.andThen(() => fs.readFileString(pkgPath, "utf-8")),
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
            Effect.andThen(() => Effect.zipRight(Ref.set(CURRENT_REF, Option.some(project)), loadRecents(RECENT_PROJECT_PATH))),
            Effect.andThen((recents) => saveRecents(RECENT_PROJECT_PATH, [project, ...recents.filter((p) => p.path !== project.path)].slice(0, 10))),
          ))
        ))
      ),
      close: () => Ref.set(CURRENT_REF, Option.none()),
      listRecents: () => loadRecents(RECENT_PROJECT_PATH),
      getCurrent: () => Ref.get(CURRENT_REF),
    })
  }),
));
