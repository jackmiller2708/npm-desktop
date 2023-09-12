import { Workspace } from 'src/angular/shared/models/workspace.model';
import { MenuItem } from '../../menu-dropdown/models/menu-item.model';
import { List } from 'immutable';

export interface IWorkspaceHistoryItem {
  dataSource:Workspace | undefined;
  menuItems: List<MenuItem>;
  isEditing: boolean;
  isMenuShown: boolean;
}
