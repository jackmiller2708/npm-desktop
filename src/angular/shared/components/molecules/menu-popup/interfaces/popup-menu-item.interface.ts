export interface IPopupMenuItem {
  content: string;
  onClick: () => void;
  separator: boolean
  disabled: boolean;
  iconPath?: string;
  className?: string;
}
