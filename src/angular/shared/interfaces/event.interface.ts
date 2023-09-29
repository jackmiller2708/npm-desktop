import { RecordOf } from 'immutable';

export interface IEvent {
  type: string;
  message: string;
}

export type IAppEvent = RecordOf<IEvent>;
