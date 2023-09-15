import { ChangeDetectionStrategy, Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, Subscription, takeUntil } from 'rxjs';
import { InterProcessCommunicator } from '../shared/services/IPC/inter-process-communicator.service';
import { ToastService } from '../shared/services/toast/toast.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, OnDestroy {
  private readonly _ngDestroy$: Subject<void>;

  @HostBinding('class')
  private get _classes(): string[] {
    return ['h-screen', 'w-screen', 'block', 'flex', 'flex-col', 'items-center', 'justify-center', 'relative', 'overflow-hidden'];
  }

  constructor(
    private readonly _IPC: InterProcessCommunicator, 
    private readonly _toastService: ToastService
  ) {
    this._ngDestroy$ = new Subject();
  }

  ngOnInit(): void {
    this._initStores();
  }

  ngOnDestroy(): void {
    this._ngDestroy$.next();
  }

  private _handleError(error: Record<string, any>) {
    this._toastService.addMessage({
      text: error['message'] as string,
      variant: 'error',
      isAutoDismiss: false,
      actionLabel: undefined,
    });
  }

  private _initStores() {
    const error$ = this._IPC.on<Record<string, any>>('system-error');

    this._register(error$, this._handleError);
  }

  private _register<T>(store$: Observable<T>, processor: (data: T) => void): Subscription {
    return store$
      .pipe(takeUntil(this._ngDestroy$))
      .subscribe(processor.bind(this));
  }
}
