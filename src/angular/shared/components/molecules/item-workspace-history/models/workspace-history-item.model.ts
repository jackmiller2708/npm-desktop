import { IWorkspaceHistoryItem } from '../interfaces/workspace-history-item.interface';
import { List, Record } from 'immutable';

const defaultValues: IWorkspaceHistoryItem = {
  dataSource: undefined,
  menuItems: List(),
  isEditing: false,
  isMenuShown: false,
};

export class WorkspaceHistoryItem extends Record<IWorkspaceHistoryItem>(defaultValues) {}
