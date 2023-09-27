import { ChangeDetectionStrategy, Component, HostBinding, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { Subject, debounceTime, fromEvent, map, merge } from 'rxjs';
import { InterProcessCommunicator } from '@services/IPC/inter-process-communicator.service';
import { ToastService } from '@services/toast/toast.service';
import { IToastItem } from '@components/molecules/display-toast/interfaces/toast-item.interface';
import { Helper } from '@shared/helper.class';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, OnDestroy {
  private readonly _ngDestroy$: Subject<void>;
  private _isWindowActive: boolean;
  private _isWindowMaximize: boolean;

  @HostBinding('class')
  private get _classes(): string[] {
    return ['h-screen', 'w-screen', 'flex', 'flex-col'];
  }

  private get _isWindowMaximized(): boolean {
    return (
      window.innerWidth === screen.availWidth &&
      window.innerHeight === screen.availHeight
    );
  }

  get isWindowActive(): boolean {
    return this._isWindowActive;
  }


  get isWindowMaximize(): boolean {
    return this._isWindowMaximize;
  }

  constructor(
    private readonly _IPC: InterProcessCommunicator,
    private readonly _toastService: ToastService,
    private readonly _CDR: ChangeDetectorRef
  ) {
    this._isWindowMaximize = this._isWindowMaximized;
    this._isWindowActive = document.hasFocus();
    this._ngDestroy$ = new Subject();
  }

  ngOnInit(): void {
    this._initStores();
  }

  ngOnDestroy(): void {
    this._ngDestroy$.next();
  }

  private _handleWindowResize() {
    this._isWindowMaximize = this._isWindowMaximized;
    this._CDR.detectChanges();
  }

  private _handleWindowVisibilityChange(isFocus: boolean): void {
    this._isWindowActive = isFocus;
    this._CDR.detectChanges();
  }

  private _handleError(error: Record<string, any>) {
    this._toastService.addMessage({
      text: error['message'] as string,
      variant: 'error',
      isAutoDismissible: true,
    } as IToastItem);
  }

  private _initStores() {
    const _register = Helper.makeObservableRegistrar.call(this, this._ngDestroy$);

    const error$ = this._IPC.on<Record<string, any>>('system-error');
    const windowResize$ = fromEvent(window, 'resize').pipe(debounceTime(100));
    const windowVisibilityChange$ = merge(
      fromEvent(window, 'focus').pipe(map(() => true)),
      fromEvent(window, 'blur').pipe(map(() => false))
    ); 

    _register(error$, this._handleError);
    _register(windowVisibilityChange$, this._handleWindowVisibilityChange);
    _register(windowResize$, this._handleWindowResize);
  }
}
