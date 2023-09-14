import { IPopupMenuProps } from '../interfaces/popup-menu-props.interface';
import { Record } from 'immutable';

const defaultValues: IPopupMenuProps = {
  dataSource: undefined,
  target: undefined,
  isShown: false,
};

export class PopupMenuProps extends Record<IPopupMenuProps>(defaultValues) {}
