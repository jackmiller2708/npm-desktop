import { Button } from "@presentation/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@presentation/components/ui/input-group";
import { useWindow } from "@presentation/hooks/use-window";
import { useWorkspace } from "@presentation/hooks/use-workspace";
import { useRootStore } from "@presentation/stores/root";
import { Array as Collection, Effect, Either, Option } from "effect/index";
import { SearchIcon } from "lucide-react";
import { PropsWithChildren } from "react";

export function HasProjectStartup({ children }: PropsWithChildren) {
  const mbAddProject = useRootStore((state) => state.addProject);
    
  const win = useWindow();
  const wp = useWorkspace();

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
          onRight: addProject,
          onLeft: (): void => void 0
        }))
      ),
      onLeft: () => Effect.void
    })));
  }

	return (
		<div>
			<InputGroup className="w-full h-auto border-0 focus-within:!ring-0 px-2 py-1">
				<InputGroupInput placeholder="Try searching for projects..." />
				<InputGroupAddon>
					<SearchIcon />
				</InputGroupAddon>
				<InputGroupAddon align="inline-end">
          <Button className="!text-xs" disabled>New</Button>
          <Button className="!text-xs cursor-pointer" onClick={onOpenProjectBtnClick}>Open</Button>
          <Button className="!text-xs" disabled>Get from VCS</Button>
				</InputGroupAddon>
			</InputGroup>
			<hr />
      { children }
		</div>
	);
}
