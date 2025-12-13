import type { useWorkspace } from "@presentation/hooks/use-workspace";
import { CommandRegistryService } from "@presentation/services/command-registry";
import type { RootStore } from "@presentation/stores/root/_root.state";
import { Effect, Either, Option } from "effect";
import type { useNavigate } from "react-router";
import { toast } from "sonner";

type initCommandRegistryDeps = [
	Either.Either<RootStore['setCurrentProject'], Error>,
	Either.Either<RootStore['setMenuRecentItemsByProjects'], Error>,
	ReturnType<typeof useWorkspace>,
	ReturnType<typeof useNavigate>,
];

export function initCommandRegistry([mbSetCurrent, mbSetRecents, wp, navigate]: initCommandRegistryDeps) {
	return CommandRegistryService.pipe(Effect.andThen((service) => Effect.all([
    //
    service.register("close-project", () => wp.close().pipe(
      Effect.tap(() => mbSetCurrent.pipe(Either.match({
        onRight: (set) => set(Option.none()),
        onLeft: (): void => void 0,
      }))),
      Effect.tap(() => navigate("/")),
    )),

    //
    service.register('open-recent-project', ([path]: string[]) => Either.all([mbSetCurrent, mbSetRecents]).pipe(Either.match({
      onRight: ([setCurrent, setRecents]) => Effect.Do.pipe(
        Effect.andThen(() => wp.open(path)),
        Effect.tap(Either.match({
          onRight: (project) => setCurrent(Option.some(project)),
          onLeft: (): void => void 0
        })),
        Effect.andThen(Either.match({
          onRight: () => wp.getRecents().pipe(
            Effect.map(Either.getRight),
            Effect.map(Option.some),
            Effect.tap(setRecents),
            Effect.asVoid
          ),
          onLeft: () => Effect.void,
        })),
        Effect.asVoid
      ),
      onLeft: () => Effect.void
    }))),

    //
    service.register("clear-recents", () => wp.clearRecents().pipe(
      Effect.map((result) => Either.all([mbSetRecents, result])),
      Effect.map(Either.match({
        onRight: ([setRecents]) => setRecents(Option.some(Option.some([]))),
        onLeft: (): void => void 0,
      }))
    )),

    //
    service.register("new-window", () => Effect.void),

    //
    service.register("open-folder", () => Effect.void),
  ], { concurrency: 'unbounded' })));
}

type initRecentProjectsDeps = [
	ReturnType<typeof useWorkspace>,
  Either.Either<RootStore['setProjects'], Error>,
	Either.Either<RootStore['setMenuRecentItemsByProjects'], Error>,
  Either.Either<RootStore["projects"], Error>
]

export function initRecentProjects([wp, mbSetProjects, mbSetRecents, mbLoadedProjects]: initRecentProjectsDeps) {
  return Either.Do.pipe(
    Either.andThen(() => Either.all([mbSetProjects, mbLoadedProjects, mbSetRecents])),
    Either.map(([setProjects, projects, setRecents]) => Effect.Do.pipe(
      Effect.andThen(() => Option.flatten(projects).pipe(Option.match({
        onSome: (projectList) => Effect.succeed(Either.right(projectList)),
        onNone: wp.getRecents
      }))),
      Effect.map(Either.map(Option.some)),
      Effect.map(Either.map(Option.some)),
      Effect.tap(Either.match({
        onRight: (projects) => {
          setProjects(projects);
          setRecents(projects);
        },
        onLeft: (error) => toast("Unable to load projects", { description: error.message })
      })),
    )),
    Either.getOrThrow
  );
}
