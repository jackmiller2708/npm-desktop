import { RecordOf } from 'immutable';

export interface IEvent {
  type: string;
  message: string;
  data: any;
}

export type IAppEvent = RecordOf<IEvent>;
