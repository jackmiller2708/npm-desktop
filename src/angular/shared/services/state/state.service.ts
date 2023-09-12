import { MonadService } from '../monad/monad.service';
import { Injectable } from '@angular/core';
import { RecordOf } from 'immutable';
import { State } from '../monad/models/state.monad';

@Injectable({ providedIn: 'root' })
export class StateService {
  constructor(private readonly _monadService: MonadService) {}

  updateState<T extends object>(states: RecordOf<T>, propertyName: keyof T, updater: (value: T[keyof T]) => T[keyof T]): State<void, RecordOf<T>[]> {
    return this._monadService
      .state<void, RecordOf<T>>(states)
      .map((_states: RecordOf<T>): RecordOf<T>[] => [_states, _states.update(propertyName, updater)]);
  }
}
