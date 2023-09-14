export interface IPopupMenuItem {
  content: string;
  onClick: () => void;
  separator: boolean
  iconPath?: string;
  className?: string;
}
