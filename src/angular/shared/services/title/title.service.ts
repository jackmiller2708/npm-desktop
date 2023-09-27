import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Injectable({ providedIn: 'root' })
export class TitleService {
  private readonly _titleStore: BehaviorSubject<string | undefined>;
  readonly titleStore$: Observable<string | undefined>;

  constructor(private readonly _title: Title) {
    this._titleStore = new BehaviorSubject<string | undefined>(undefined);
    this.titleStore$ = this._titleStore.asObservable();
  }

  removeTitle(): void {
    this._titleStore.next(undefined);
  }

  setTitle(value: string): void {
    this._titleStore.next(value);
  }

  getTitle(): string | undefined {
    return this._titleStore.getValue();
  }

  resetWindowTitle(): void {
    this._title.setTitle('NPM Desktop');
  }

  getWindowTitle(): string {
    return this._title.getTitle();
  }

  setWindowTitle(value: string): void {
    this._title.setTitle(value);
  }
}
