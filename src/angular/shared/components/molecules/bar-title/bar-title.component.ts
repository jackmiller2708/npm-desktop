import { Component, HostBinding, Input, OnInit,   OnDestroy, ChangeDetectorRef } from '@angular/core';
import { InterProcessCommunicator } from '@shared/services/IPC/inter-process-communicator.service';
import { IconComponent } from '@shared/components/atoms/icon/icon.component';
import { TitleService } from '@shared/services/title/title.service';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { Helper } from '@shared/helper.class';

@Component({
  selector: 'app-bar-title',
  templateUrl: './bar-title.component.html',
  styleUrls: ['./bar-title.component.scss'],
  standalone: true,
  imports: [CommonModule, IconComponent],
})
export class BarTitleComponent implements OnInit, OnDestroy {
  private readonly _ngDestroy: Subject<void>;
  private _blurred: boolean;
  private _isMaximized: boolean;
  private _title: string | undefined;
  private _isVisible: boolean;

  @HostBinding('class')
  private get _classes(): string[] {
    const classes = [
      'relative',
      'flex',
      'justify-between',
      'items-center',
      'w-screen',
      'h-8',
      this._blurred ? 'bg-gray-900' : 'bg-black',
      'pl-2',
    ];

    if (!this._isVisible) {
      classes.push('hidden')
    }

    return classes;
  }

  @Input()
  set blurred(value: boolean) {
    this._blurred = value;
  }

  @Input()
  set isVisible(value: boolean) {
    this._isVisible = value;
  }

  @Input()
  set isMaximized(value: boolean) {
    this._isMaximized = value;
  }

  get isMaximized(): boolean {
    return this._isMaximized;
  }

  get title(): string | undefined {
    return this._title;
  }

  constructor(
    private readonly _IPC: InterProcessCommunicator,
    private readonly _titleService: TitleService,
    private readonly _CDR: ChangeDetectorRef
  ) {
    this._ngDestroy = new Subject();
    this._isVisible = true;
    this._blurred = false;
    this._isMaximized = false;
  }

  ngOnInit(): void {
    Helper.makeObservableRegistrar.call(this, this._ngDestroy)(
      this._titleService.titleStore$,
      (title) => {
        this._title = title;
        this._CDR.detectChanges();
      }
    );
  }

  ngOnDestroy(): void {
    this._ngDestroy.next();
  }

  onMaximizeControlClick(): void {
    this._IPC.send('window-control', JSON.stringify({ command: 'maximize' }));
  }

  onMinimizeControlClick(): void {
    this._IPC.send('window-control', JSON.stringify({ command: 'minimize' }));
  }

  onCloseControlClick(): void {
    this._IPC.send('window-control', JSON.stringify({ command: 'close' }));
  }

  onRestoreControlClick(): void {
    this._IPC.send('window-control', JSON.stringify({ command: 'restore' }));
  }
}
