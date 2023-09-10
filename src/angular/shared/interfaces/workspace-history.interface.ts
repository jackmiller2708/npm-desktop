import { List, RecordOf } from 'immutable';
import { IWorkspace } from './workspace.interface';

export interface IWorkspaceHistory {
  workspaces: List<RecordOf<IWorkspace>>;
  lastOpened?: RecordOf<IWorkspace>;
}
