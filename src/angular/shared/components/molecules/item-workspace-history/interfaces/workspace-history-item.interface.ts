import { List, RecordOf } from 'immutable';
import { IWorkspace } from 'src/angular/shared/interfaces/workspace.interface';
import { MenuItem } from '../../menu-dropdown/models/menu-item.model';

export interface IWorkspaceHistoryItem {
  dataSource: RecordOf<IWorkspace> | undefined;
  menuItems: List<MenuItem>;
  isEditing: boolean;
  isMenuShown: boolean;
}
