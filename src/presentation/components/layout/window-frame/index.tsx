import { useWindow } from "@presentation/hooks/use-window";
import { Effect, Either } from "effect/index";
import { PropsWithChildren, useEffect, useState } from "react";
import { TitleBar } from "./_title-bar";
import { WindowDisplayState, WindowFocusState } from "./_title-bar.interface";

export function WindowFrame({ children }: PropsWithChildren) {
  const { close, maximize, minimize, unmaximize } = useWindow();

  const [focusState, setFocusState] = useState(WindowFocusState.Active);
  const [displayState, setDisplayState] = useState(WindowDisplayState.Normal);

  function onMinimize() {
    Effect.runPromise(minimize().pipe(Effect.tap(Either.match({
      onRight: () => setDisplayState(WindowDisplayState.Minimized),
      onLeft: () => void 0
    }))));
  }

  function onMaximizeToggle() {
    Effect.runPromise(Effect.if(displayState === WindowDisplayState.Maximized, {
      onTrue: unmaximize,
      onFalse: maximize,
    }));
  }

  function onClose() {
    Effect.runPromise(close());
  }

  useEffect(() => {
    window.windowState.onMinimize(() => setDisplayState(WindowDisplayState.Minimized));
    window.windowState.onUnmaximize(() => setDisplayState(WindowDisplayState.Normal));
    window.windowState.onMaximize(() => setDisplayState(WindowDisplayState.Maximized));
  }, [])

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
