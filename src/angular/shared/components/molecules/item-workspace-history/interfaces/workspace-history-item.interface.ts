import { PopupMenuItem } from '../../menu-popup/models/popup-menu-item.model';
import { Workspace } from '@models/workspace.model';
import { List } from 'immutable';

export interface IWorkspaceHistoryItem {
  dataSource:Workspace | undefined;
  menuItems: List<PopupMenuItem>;
  isEditing: boolean;
  isMenuShown: boolean;
}
