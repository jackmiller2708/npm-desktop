import { IMenuItem } from '../interfaces/menu-item.interface';
import { Record } from 'immutable';

const defaultValues: IMenuItem = {
  content: '',
  onClick: () => void null,
  separator: false,
  className: undefined,
  iconPath: undefined,
};

export class MenuItem extends Record<IMenuItem>(defaultValues) {
  get classNames(): string[] {
    return ([] as string[]).concat(this.className?.split(' ') ?? []);
  }
}
