import { Kbd, KbdGroup } from "@presentation/components/ui/kbd";
import clsx from "clsx";
import { Search } from "lucide-react";
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
    <div className={clsx("h-[32px] text-[12px] flex justify-between leading-none bg-background relative shrink-0", styles['title-bar'], { inactive })}>
      <div className="flex items-center pl-4">
        <svg width="17.84" height="20" viewBox="0 0 17.84 20" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid">
          <path d="M.555 5.042 9.039.103l8.484 4.94v9.871l-8.484 4.94-8.484-4.94z" fill="#c00"/>
          <path d="m9.276 9.975 7.889-4.544.318 9.157-8.206 4.955z" fill="#fff"/>
          <path d="m17.285 5.154-.024 9.705-8.23 4.774-.04-9.539zm-6.923 5.732.024 6.375 2.735-1.594-.007-4.805 1.38-.816v4.821l1.38-.809.007-6.454z" fill="#c00"/>
          <path d="M9.579.175c-.381-.214-.991-.214-1.371 0L.69 4.496c-.381.214-.683.752-.683 1.181v8.643c0 .436.309.968.683 1.181l7.516 4.321c.38.214.991.214 1.371 0l7.516-4.321c.381-.214.683-.754.683-1.181V5.678c0-.436-.309-.968-.683-1.181zm6.669 4.52c.38.214.38.571 0 .785L9.666 9.262c-.38.214-.991.214-1.371 0L1.618 5.424c-.381-.214-.381-.571 0-.785L8.199.856c.381-.214.991-.214 1.371 0zM.595 6.304c0-.436.309-.61.683-.396l6.731 3.869c.38.214.681.754.681 1.181v7.675c0 .436-.309.61-.681.396L1.278 15.16c-.38-.214-.683-.754-.683-1.181zm9.38 12.607c-.381.214-.683.04-.683-.396v-7.556c0-.436.309-.968.681-1.181l6.534-3.75c.381-.214.683-.04.683.396v7.556c0 .436-.309.968-.683 1.181z" fill="#910505"/>
        </svg>

      </div>
      <div className={clsx("text-accent-foreground opacity-60 hover:opacity-80 flex items-center cursor-pointer absolute top-1/2 left-1/2 -translate-1/2", styles['no-drag'])}>
        <div className="border border-muted bg-background rounded-sm w-[30vw] text-center py-1.5 min-w-96 relative">
          <Search size={15} className="absolute left-2 top-1/2 -translate-y-1/2" />
          {title}
          <KbdGroup className="absolute right-2 top-1/2 -translate-y-1/2"> 
            <Kbd>Ctrl</Kbd>
            <span>+</span>
            <Kbd>P</Kbd>
          </KbdGroup>
        </div>
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