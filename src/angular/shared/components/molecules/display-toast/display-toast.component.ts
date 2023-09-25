import { Component, HostBinding, ElementRef, OnDestroy, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Observable, Subject, switchMap, timer, tap, takeUntil, firstValueFrom, take } from 'rxjs';
import { DisplayToastService } from './services/display-toast.service';
import { ItemToastComponent } from '../item-toast/item-toast.component';
import { PopupComponent } from '../../atoms/popup/popup.component';
import { AnimeInstance } from 'animejs';
import { MonadService } from '@services/monad/monad.service';
import { CommonModule } from '@angular/common';
import { ToastService } from '@services/toast/toast.service';
import { ToastItem } from './models/toast-item.model';
import { List, Stack } from 'immutable';
import { Helper } from '@shared/helper.class';

import anime from 'animejs/lib/anime.es';

const TOAST_ANIMATION_DURATION = 100;

@Component({
  selector: 'app-display-toast',
  standalone: true,
  templateUrl: './display-toast.component.html',
  styleUrls: ['./display-toast.component.scss'],
  imports: [CommonModule, ItemToastComponent, PopupComponent],
  providers: [DisplayToastService],
})
export class DisplayToastComponent implements OnInit, OnDestroy {
  private readonly _toastAnimationFinish$: Subject<void>;
  private readonly _startToastCountdown$: Subject<number>;
  private readonly _stopToastCountdown$: Subject<void>;
  private readonly _ngDestroy$: Subject<void>;

  @ViewChild('toastContainer', { static: true })
  private readonly _toastContainer!: ElementRef<HTMLDivElement>;

  private _priorityStack: Stack<ToastItem>;
  private _waitList: List<ToastItem>;
  private _currentToast: ToastItem | undefined;
  private _isShown: boolean;

  @HostBinding('class')
  private get _classes(): string[] {
    return ['fixed', 'right-2', 'bottom-2'];
  }

  get currentMessage(): ToastItem | undefined {
    return this._currentToast;
  }

  get isMessageShown(): boolean {
    return this._isShown && !!this._priorityStack.size;
  }

  constructor(
    private readonly _CDR: ChangeDetectorRef,
    private readonly _toastService: ToastService,
    private readonly _displayToastService: DisplayToastService,
    private readonly _monadService: MonadService
  ) {
    this._ngDestroy$ = new Subject();
    this._startToastCountdown$ = new Subject();
    this._stopToastCountdown$ = new Subject();
    this._toastAnimationFinish$ = new Subject();
    this._isShown = false;

    this._priorityStack = Stack();
    this._waitList = List();
  }

  ngOnInit(): void {
    this._initStores();
  }

  ngOnDestroy(): void {
    this._ngDestroy$.next();
  }

  onToastClose(): void {
    this._stopToastCountdown$.next();
    this._playCloseAnimation();

    firstValueFrom(this._toastAnimationFinish$).then(
      this._onToastFinished.bind(this)
    );
  }

  //#region Private Event Handler
  private _onToastFinished(): void {
    this._priorityStack = this._updateToastsAndSort(
      this._popToast(this._priorityStack),
      (_toasts) => _toasts.concat(this._waitList)
    );

    this._waitList = this._waitList.clear();
    this._startBroadcasting();
  }

  private _onToastAdd(toast: ToastItem): void {
    if (this._isShown) {
      return void (this._waitList = this._holdToast(this._waitList, toast));
    }

    this._priorityStack = this._updateToastsAndSort(
      this._priorityStack,
      (_toasts) => this._addToast(_toasts, toast)
    );

    this._CDR.detectChanges();
    this._startBroadcasting();
  }
  //#endregion

  //#region Private Helpers
  private _addToast(collection: Stack<ToastItem>, toast: ToastItem) {
    return collection.push(toast);
  }

  private _holdToast(collection: List<ToastItem>, toast: ToastItem) {
    return collection.push(toast);
  }

  private _popToast(collection: Stack<ToastItem>) {
    return collection.pop();
  }

  private _sortToasts(collection: Stack<ToastItem>) {
    return collection.sort(this._displayToastService.sortFn.byPriority);
  }

  private _updateToastsAndSort(collection: Stack<ToastItem>, updateFn: (collection: Stack<ToastItem>) => Stack<ToastItem>) {
    const [newStack] = this._monadService
      .state(collection)
      .map(updateFn)
      .map(this._sortToasts.bind(this))
      .run(collection);

    return newStack;
  }

  private _startBroadcasting(): void {
    const currentToast = this._priorityStack.first();

    if (!currentToast) {
      return this._stopBroadCasting();
    }

    if (currentToast.isAutoDismissible) {
      this._startToastCountdown$.next(currentToast.duration);
    }

    this._isShown = true;
    this._currentToast = currentToast;
    this._CDR.detectChanges();
    this._playOpenAnimation();
  }

  private _stopBroadCasting(): void {
    this._isShown = false;
    this._currentToast = undefined;
    this._CDR.detectChanges();
  }

  private _openAnimation(): AnimeInstance {
    return anime({
      targets: this._toastContainer.nativeElement,
      translateX: 'calc(-100% - 0.5rem)',
      autoplay: false,
      easing: 'spring(1, 80, 10, 0)',
      duration: TOAST_ANIMATION_DURATION,
      complete: () => this._toastAnimationFinish$.next(),
    });
  }

  private _closeAnimation(): AnimeInstance {
    return anime({
      targets: this._toastContainer.nativeElement,
      translateX: ['calc(-100% - 0.5rem)', 'calc(0% - 0.5rem)'],
      autoplay: false,
      easing: 'cubicBezier(.5, .05, .1, .3)',
      duration: TOAST_ANIMATION_DURATION,
      complete: () => this._toastAnimationFinish$.next(),
    });
  }

  private _playOpenAnimation(): void {
    this._openAnimation().play();
  }

  private _playCloseAnimation(): void {
    this._closeAnimation().play();
  }

  private _getToastTimer() {
    const _getTimer = (duration: number) =>
      timer(duration + TOAST_ANIMATION_DURATION).pipe(takeUntil(this._stopToastCountdown$));

    return this._startToastCountdown$.pipe(
      switchMap(_getTimer),
      tap((): void => this._playCloseAnimation()),
      switchMap((): Observable<void> => this._toastAnimationFinish$.pipe(take(1))),
    );
  }
  //#endregion

  //#region Observable Helpers
  private _initStores(): void {
    const _register = Helper.makeObservableRegistrar.call(this, this._ngDestroy$);
    const { addMessage$ } = this._toastService;

    _register(this._getToastTimer(), this._onToastFinished);
    _register(addMessage$ as Observable<ToastItem>, this._onToastAdd);
  }
  //#endregion
}
