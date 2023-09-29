import { IEvent } from '@shared/interfaces/event.interface';
import { Record } from 'immutable';

enum EventTypes {
  EDITOR = 'editor',
  WORKSPACE = 'workspace',
}

export enum EditorEventMessages {
  CLOSE = 'close-editor',
}

export enum WorkspaceEventMessages {
  CLOSE = 'close-workspace',
}

export class EditorEvent extends Record<IEvent>({
  type: EventTypes.EDITOR,
  message: '',
}) {}

export class WorkspaceEvent extends Record<IEvent>({
  type: EventTypes.WORKSPACE,
  message: '',
}) {}
