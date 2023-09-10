import { IMenuItem } from '../interfaces/menu-item.interface';
import { Record } from 'immutable';

export class MenuItem extends Record<IMenuItem>({
  content: '',
  onClick: () => void null,
  separator: false,
  className: undefined,
  iconPath: undefined,
}) {
  get classNames(): string[] {
    return ([] as string[]).concat(this.className?.split(' ') ?? []);
  }
}
