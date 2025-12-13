import type { useWorkspace } from "@presentation/hooks/use-workspace";
import { CommandRegistryService } from "@presentation/services/command-registry";
import type { RootStore } from "@presentation/stores/root/_root.state";
import { Effect, Either, Option } from "effect";
import type { useNavigate } from "react-router";
import { toast } from "sonner";

type initCommandRegistryDeps = [
	Either.Either<RootStore['setCurrentProject'], Error>,
	Either.Either<RootStore["addProject"], Error>,
	ReturnType<typeof useWorkspace>,
	ReturnType<typeof useNavigate>,
];

export function initCommandRegistry([mbSetCurrentProject, mbAddProject, wp, navigate]: initCommandRegistryDeps) {
	return CommandRegistryService.pipe(Effect.andThen((service) => Effect.all([
    service.register("close-project", () => wp.close().pipe(
      Effect.tap(() => mbSetCurrentProject.pipe(Either.match({
        onRight: (set) => set(Option.none()),
        onLeft: (): void => void 0,
      }))),
      Effect.tap(() => navigate("/")),
    )),
    service.register('open-project', ([path]: string[]) => Either.all([mbSetCurrentProject, mbAddProject]).pipe(Either.match({
      onRight: ([set, add]) => Effect.Do.pipe(
        Effect.andThen(() => wp.open(path)),
        Effect.tap(Either.match({ onRight: add, onLeft: (): void => void 0 })),
        Effect.tap(Either.match({ onRight: (project) => set(Option.some(project)), onLeft: (): void => void 0 })),
        Effect.asVoid
      ),
      onLeft: () => Effect.void
    }))),
    service.register("new-window", () => Effect.void),
    service.register("open-folder", () => Effect.void),
    service.register("clear-recents", () => Effect.void),
  ], { concurrency: 'unbounded' })));
}

type initRecentProjectsDeps = [
	ReturnType<typeof useWorkspace>,
  Either.Either<RootStore['setProjects'], Error>,
  Either.Either<RootStore["projects"], Error>
]

export function initRecentProjects([wp, mbSetProjects, mbLoadedProjects]: initRecentProjectsDeps) {
  return Either.Do.pipe(
    Either.andThen(() => Either.all([mbSetProjects, mbLoadedProjects])),
    Either.map(([setProjects, projects]) => Effect.Do.pipe(
      Effect.andThen(() => Option.flatten(projects).pipe(Option.match({
        onSome: (projectList) => Effect.succeed(Either.right(projectList)),
        onNone: wp.getRecents
      }))),
      Effect.map(Either.map(Option.some)),
      Effect.map(Either.map(Option.some)),
      Effect.tap(Either.match({
        onRight: setProjects,
        onLeft: (error) => toast("Unable to load projects", { description: error.message })
      })),
    )),
    Either.getOrThrow
  );
}
