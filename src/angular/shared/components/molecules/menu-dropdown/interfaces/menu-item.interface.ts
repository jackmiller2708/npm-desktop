export interface IMenuItem {
  content: string;
  onClick: () => void;
  separator: boolean
  iconPath?: string;
  className?: string;
}
