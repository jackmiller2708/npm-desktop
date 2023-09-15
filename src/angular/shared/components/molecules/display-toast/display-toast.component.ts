import { Component, HostBinding, ElementRef, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { Observable, Subject, switchMap, takeUntil, tap, timer } from 'rxjs';
import { DisplayToastService } from './services/display-toast.service';
import { ItemToastComponent } from '../item-toast/item-toast.component';
import { PopupComponent } from '../../atoms/popup/popup.component';
import { MonadService } from 'src/angular/shared/services/monad/monad.service';
import { CommonModule } from '@angular/common';
import { ToastService } from 'src/angular/shared/services/toast/toast.service';
import { ToastItem } from './models/toast-item.model';
import { Stack } from 'immutable';

@Component({
  selector: 'app-display-toast',
  standalone: true,
  templateUrl: './display-toast.component.html',
  styleUrls: ['./display-toast.component.scss'],
  imports: [CommonModule, ItemToastComponent, PopupComponent],
  providers: [DisplayToastService],
})
export class DisplayToastComponent implements OnInit, OnDestroy {
  private readonly _ngDestroy$: Subject<void>;

  private _startMessageCountdown$: Subject<number>;
  private _messages: Stack<ToastItem>;
  private _isShown: boolean;

  @HostBinding('class')
  private get _classes(): string[] {
    return ['fixed', 'right-2', 'bottom-2'];
  }

  get message(): ToastItem {
    return this._messages.first();
  }

  get hostElement(): Element {
    return this._el.nativeElement;
  }

  get isMessageShown(): boolean {
    return this._isShown && !!this._messages.size;
  }

  constructor(
    private readonly _CDR: ChangeDetectorRef,
    private readonly _el: ElementRef,
    private readonly _toastService: ToastService,
    private readonly _displayToastService: DisplayToastService,
    private readonly _monadService: MonadService
  ) {
    this._ngDestroy$ = new Subject();
    this._startMessageCountdown$ = new Subject();
    this._isShown = false;
    this._messages = Stack();
  }

  ngOnInit(): void {
    this._initStores();
  }

  ngOnDestroy(): void {
    this._ngDestroy$.next();
  }

  onToastClose(): void {
    this._isShown = false;
    
    if (this._messages.size) {
      return this._onMessageFinished();
    }

    this._CDR.detectChanges();
  }

  private _onMessageFinished() {
    const nextMessage = this._messages.first();

    this._isShown = false;

    if (nextMessage) {
      this._messages = this._messages.pop();

      if (nextMessage.duration) {
        this._startMessageCountdown$.next(nextMessage.duration);
      }

      this._isShown = true;
    }

    this._CDR.detectChanges();
  }

  private _onMessageAdd(message: ToastItem): void {
    const [newMessages] = this._monadService
      .state(message)
      .map((_message) => this._addMessage(this._messages, _message))
      .map(this._sortMessagesByPriority.bind(this))
      .run(message);

    this._messages = newMessages;
    this._isShown = true;

    if (message.duration) {
      this._startMessageCountdown$.next(message.duration);
    }

    this._CDR.detectChanges();
  }

  private _addMessage(collection: Stack<ToastItem>, message: ToastItem): Stack<ToastItem> {
    return collection.push(message);
  }

  private _sortMessagesByPriority(collection: Stack<ToastItem>): Stack<ToastItem> {
    return collection.sort(this._displayToastService.sortFn.byPriority);
  }

  private _initStores(): void {
    const { addMessage$ } = this._toastService;

    this._register(this._getMessageCounter(), this._onMessageFinished);
    this._register(addMessage$, this._onMessageAdd);
  }

  private _getMessageCounter() {
    return this._startMessageCountdown$.pipe(
      switchMap((duration: number) => timer(duration))
    );
  }

  private _register<T>(store$: Observable<T>, processor: (data: T) => void) {
    return store$
      .pipe(takeUntil(this._ngDestroy$))
      .subscribe(processor.bind(this));
  }
}
