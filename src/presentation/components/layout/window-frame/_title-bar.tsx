import clsx from "clsx";
import { SystemIcon } from "../../ui/system-icon";
import { WindowDisplayState, WindowFocusState } from "./_title-bar.interface";
import styles from './_title-bar.module.css';

interface TitlebarProps {
  title?: string;
  focusState: WindowFocusState;
  displayState: WindowDisplayState;
  onMinimize(): void;
  onMaximizeToggle(): void;
  onClose(): void;
}

export function TitleBar({ title = "NPM Desktop", focusState, displayState, onMinimize, onMaximizeToggle, onClose }: TitlebarProps) {
  const isMaximized = displayState === WindowDisplayState.Maximized;
  const inactive = focusState === WindowFocusState.Inactive;

  return (
    <div className={clsx("h-[32px] text-[12px] flex justify-between leading-none bg-background", styles['title-bar'], { inactive })}>
      <div className="flex leading-none">
        <span className="flex px-4 items-center text-foreground">{title}</span>
      </div>
      <div className={clsx("flex", styles['no-drag'])}>
        <button
          className="px-4 flex items-center text-muted-foreground hover:bg-accent hover:text-foreground"
          title="Minimize"
          onClick={onMinimize}
        >
          <SystemIcon name="ChromeMinimize" />
        </button>
        {isMaximized
          ? (
            <button
              className="px-4 flex items-center text-muted-foreground hover:bg-accent hover:text-foreground"
              title="Restore Down"
              onClick={onMaximizeToggle}
            >
              <SystemIcon name="ChromeRestore" />
            </button>
          )
          : (
            <button
              className="px-4 flex items-center text-muted-foreground hover:bg-accent hover:text-foreground"
              title="Maximize"
              onClick={onMaximizeToggle}
            >
              <SystemIcon name="ChromeMaximize" />
            </button>
          )
        }
        <button
          className="px-4 flex items-center text-muted-foreground hover:bg-destructive hover:text-foreground"
          title="Close"
          onClick={onClose}
        >
          <SystemIcon name="ChromeClose" />
        </button>
      </div>
    </div>
  );
}