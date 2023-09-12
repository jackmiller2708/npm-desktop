import { RecordOf } from 'immutable';

export interface IStateChanges<T extends object> {
  oldState: RecordOf<T> | undefined;
  currentState: RecordOf<T> | undefined;
}
