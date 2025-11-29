import { Button } from "@presentation/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@presentation/components/ui/empty";
import { useWindow } from "@presentation/hooks/use-window";
import { useWorkspace } from "@presentation/hooks/use-workspace";
import { useRootStore } from "@presentation/stores/root";
import { IconFolderCode } from "@tabler/icons-react";
import { Array as Collection, Effect, Either, Option } from "effect";
import { ArrowUpRightIcon } from "lucide-react";
import { useNavigate } from "react-router";


export function EmptyStartup() {
  const mbAddProject = useRootStore((state) => state.addProject);
  
  const win = useWindow();
  const wp = useWorkspace();
  const navigate = useNavigate();

  function onOpenProjectBtnClick() {
    Effect.runPromise(mbAddProject.pipe(Either.match({
      onRight: (addProject) => Effect.Do.pipe(
        Effect.andThen(() => win.showOpenDialog({
          title: "Open Project",
          properties: ["openDirectory"],
        })),
        Effect.map(Either.map(Collection.get(0))),
        Effect.map(Either.flatMap(Option.match({
          onSome: Either.right,
          onNone: () => Either.left(new Error("Empty Path"))
        }))),
        Effect.andThen(Either.match({
          onRight: wp.open,
          onLeft: (error) => Effect.succeed(Either.left(error))
        })),
        Effect.tap(Either.match({
          onRight: () => navigate('current-project'),
          onLeft: (): void => void 0
        })),
        Effect.tap(() => Effect.sleep('100 millis')),
        Effect.tap(Either.match({
          onRight: addProject,
          onLeft: (): void => void 0
        })),
      ),
      onLeft: () => Effect.void
    })));
  }

	return (
		<Empty>
			<EmptyHeader>
				<EmptyMedia variant="icon">
					<IconFolderCode />
				</EmptyMedia>
				<EmptyTitle>No Projects Yet</EmptyTitle>
				<EmptyDescription>
					You haven&apos;t created any projects yet. Get started by creating
					your first project.
				</EmptyDescription>
			</EmptyHeader>
			<EmptyContent>
				<div className="flex gap-2">
					<Button>Create Project</Button>
					<Button variant="outline" onClick={onOpenProjectBtnClick}>
						Open Project
					</Button>
				</div>
			</EmptyContent>
			<Button variant="link" asChild className="text-muted-foreground" size="sm">
				<a href="#">
					Learn More <ArrowUpRightIcon />
				</a>
			</Button>
		</Empty>
	);
}
