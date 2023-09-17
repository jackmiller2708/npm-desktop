import { ChangeDetectionStrategy, Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { InterProcessCommunicator } from '@services/IPC/inter-process-communicator.service';
import { ToastService } from '@services/toast/toast.service';
import { IToastItem } from '@components/molecules/display-toast/interfaces/toast-item.interface';
import { Subject } from 'rxjs';
import { Helper } from '@shared/helper.class';

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
      isAutoDismissible: true,
    } as IToastItem);
  }

  private _initStores() {
    const _register = Helper.makeObservableRegistrar.call(this, this._ngDestroy$);
    const error$ = this._IPC.on<Record<string, any>>('system-error');

    _register(error$, this._handleError);
  }
}
