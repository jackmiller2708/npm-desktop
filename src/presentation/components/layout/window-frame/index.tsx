import { PropsWithChildren, useState } from "react";
import { TitleBar } from "./_title-bar";
import { WindowDisplayState, WindowFocusState } from "./_title-bar.interface";

export function WindowFrame({ children }: PropsWithChildren) {
  const [focusState, setFocusState] = useState(WindowFocusState.Active);
  const [displayState, setDisplayState] = useState(WindowDisplayState.Normal);

	return (
		<div className="flex flex-col">
			<TitleBar 
        focusState={focusState}
        displayState={displayState}
        onMinimize={() => void 0}
        onMaximizeToggle={() => void 0}
        onClose={() => void 0}
      />
			<div className="flex-1">{children}</div>
		</div>
	);
}
