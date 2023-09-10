import { IWorkspace } from '../interfaces/workspace.interface';
import { Record } from 'immutable';

export class Workspace extends Record<IWorkspace>({
  name: '',
  path: '',
  timestamp: 0,
}) {}
