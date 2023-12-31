import { IEvent } from '@shared/interfaces/event.interface';
import { Record } from 'immutable';

enum EventTypes {
  EDITOR = 'editor',
  WORKSPACE = 'workspace',
}

export enum EditorEventMessages {
  CLOSE = 'close-editor',
  OPEN = 'open-editor',
  EXIT = 'exit-editor',
}

export enum WorkspaceEventMessages {
  CLOSE = 'close-workspace',
  OPEN = 'open-workspace',
}

export class EditorEvent extends Record<IEvent>({
  type: EventTypes.EDITOR,
  message: '',
  data: undefined,
}) {}

export class WorkspaceEvent extends Record<IEvent>({
  type: EventTypes.WORKSPACE,
  message: '',
  data: undefined,
}) {}
