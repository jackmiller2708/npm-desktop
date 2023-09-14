import { PopupMenuItem } from '../models/popup-menu-item.model';
import { List } from 'immutable';

export interface IPopupMenuProps {
  isShown: boolean;
  dataSource: List<PopupMenuItem> | undefined;
  target: Element | undefined;
}
