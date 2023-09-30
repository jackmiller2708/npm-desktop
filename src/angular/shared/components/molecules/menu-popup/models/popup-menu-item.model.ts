import { IPopupMenuItem } from '../interfaces/popup-menu-item.interface';
import { Record } from 'immutable';

const defaultValues: IPopupMenuItem = {
  content: '',
  onClick: () => void null,
  separator: false,
  className: undefined,
  iconPath: undefined,
  disabled: false
};

export class PopupMenuItem extends Record<IPopupMenuItem>(defaultValues) {
  get classNames(): string[] {
    const classes = ([] as string[]).concat(this.className?.split(' ') ?? []);

    if (this.disabled) {
      classes.push('pointer-events-none', 'opacity-60')
    }

    return classes;
  }
}
