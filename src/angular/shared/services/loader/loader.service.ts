import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoaderService {
  private readonly _isLoading: BehaviorSubject<boolean>;
  private readonly _loadAnimationStart: Subject<void>;
  private readonly _loadAnimationFinish: Subject<void>;

  readonly isLoading$: Observable<boolean>;
  readonly loadAnimationStart$: Observable<void>;
  readonly loadAnimationFinish$: Observable<void>;

  constructor() {
    this._isLoading = new BehaviorSubject(false);
    this.isLoading$ = this._isLoading.asObservable();

    this._loadAnimationStart = new Subject();
    this.loadAnimationStart$ = this._loadAnimationStart.asObservable();

    this._loadAnimationFinish = new Subject();
    this.loadAnimationFinish$ = this._loadAnimationFinish.asObservable();
  }

  setLoading(value: boolean): void {
    this._isLoading.next(value);
  }

  setAnimationState(state: 'start' | 'finish'): void {
    (state === 'start'
      ? this._loadAnimationStart
      : this._loadAnimationFinish
    ).next();
  }
}
