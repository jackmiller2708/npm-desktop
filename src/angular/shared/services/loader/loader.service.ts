import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoaderService {
  private readonly _isLoading: BehaviorSubject<boolean>;
  readonly isLoading$: Observable<boolean>;

  constructor() {
    this._isLoading = new BehaviorSubject(false);
    this.isLoading$ = this._isLoading.asObservable();
  }

  setLoading(value: boolean): void {
    this._isLoading.next(value);
  }
}
