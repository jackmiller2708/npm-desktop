import { Workspace } from '../models/workspace.model';
import { List } from 'immutable';

export interface IWorkspaceHistory {
  workspaces: List<Workspace>;
  lastOpened?: Workspace;
}
