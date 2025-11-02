import { useWindow } from "@presentation/hooks/use-window";
import { Effect, Either } from "effect/index";
import { PropsWithChildren, useState } from "react";
import { TitleBar } from "./_title-bar";
import { WindowDisplayState, WindowFocusState } from "./_title-bar.interface";

export function WindowFrame({ children }: PropsWithChildren) {
  const { close, maximize, minimize, unmaximize } = useWindow();

  const [focusState, setFocusState] = useState(WindowFocusState.Active);
  const [displayState, setDisplayState] = useState(WindowDisplayState.Normal);

  function onMinimize() {
    Effect.runPromise(minimize());
  }

  function onMaximizeToggle() {
    Effect.runPromise(Effect.Do.pipe(
      Effect.andThen(() => Effect.if(displayState === WindowDisplayState.Maximized, { onTrue: unmaximize, onFalse: maximize })),
      Effect.tap(Either.match({
        onRight: () => setDisplayState(state => state === WindowDisplayState.Maximized 
          ? WindowDisplayState.Normal 
          : WindowDisplayState.Maximized
        ),
        onLeft: () => void 0
      }))
    ));
  }

  function onClose() {
    Effect.runPromise(close());
  }

	return (
		<div className="flex flex-col">
			<TitleBar 
        focusState={focusState}
        displayState={displayState}
        onMinimize={onMinimize}
        onMaximizeToggle={onMaximizeToggle}
        onClose={onClose}
      />
			<div className="flex-1">{children}</div>
		</div>
	);
}
