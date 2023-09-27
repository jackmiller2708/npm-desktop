import { Subject, Observable } from 'rxjs';
import { IToastItem } from '../../components/molecules/display-toast/interfaces/toast-item.interface';
import { Injectable } from '@angular/core';
import { ToastItem } from '../../components/molecules/display-toast/models/toast-item.model';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly _addMessage: Subject<ToastItem>;
  private readonly _clearMessages: Subject<void>;

  readonly addMessage$: Observable<ToastItem>;
  readonly clearMessages$: Observable<void>;

  constructor() {
    this._addMessage = new Subject();
    this.addMessage$ = this._addMessage.asObservable();

    this._clearMessages = new Subject();
    this.clearMessages$ = this._clearMessages.asObservable();
  }

  addMessage(message: IToastItem): void {
    this._addMessage.next(new ToastItem(message));
  }

  clearMessages(): void {
    this._clearMessages.next();
  }
}
