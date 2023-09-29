import { Subject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { RecordOf } from 'immutable';
import { IEvent } from '@shared/interfaces/event.interface';

@Injectable({ providedIn: 'root' })
export class EventBusService {
  private readonly _appEvents: Subject<RecordOf<IEvent>>;
  readonly appEvents$: Observable<RecordOf<IEvent>>;

  constructor() {
    this._appEvents = new Subject();
    this.appEvents$ = this._appEvents.asObservable();
  }

  emit(event: RecordOf<IEvent>): void {
    this._appEvents.next(event);
  }
}
