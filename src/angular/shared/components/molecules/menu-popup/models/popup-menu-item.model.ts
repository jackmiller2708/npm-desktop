import { IPopupMenuItem } from '../interfaces/popup-menu-item.interface';
import { Record } from 'immutable';

const defaultValues: IPopupMenuItem = {
  content: '',
  onClick: () => void null,
  separator: false,
  className: undefined,
  iconPath: undefined,
};

export class PopupMenuItem extends Record<IPopupMenuItem>(defaultValues) {
  get classNames(): string[] {
    return ([] as string[]).concat(this.className?.split(' ') ?? []);
  }
}
