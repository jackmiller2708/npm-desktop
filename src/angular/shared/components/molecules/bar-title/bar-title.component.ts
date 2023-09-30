import { EditorEvent, EditorEventMessages, WorkspaceEvent, WorkspaceEventMessages } from '@shared/models/event.model';
import { Component, HostBinding, Input, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { InterProcessCommunicator } from '@shared/services/IPC/inter-process-communicator.service';
import { MenuPopupComponent } from '../menu-popup/menu-popup.component';
import { ConnectedPosition } from '@angular/cdk/overlay';
import { EventBusService } from '@shared/services/event-bus/event-bus.service';
import { IconComponent } from '@shared/components/atoms/icon/icon.component';
import { PopupMenuItem } from '../menu-popup/models/popup-menu-item.model';
import { TitleService } from '@shared/services/title/title.service';
import { CommonModule } from '@angular/common';
import { IAppEvent } from '@shared/interfaces/event.interface';
import { Subject } from 'rxjs';
import { Helper } from '@shared/helper.class';
import { List } from 'immutable';

@Component({
  selector: 'app-bar-title',
  templateUrl: './bar-title.component.html',
  styleUrls: ['./bar-title.component.scss'],
  standalone: true,
  imports: [CommonModule, IconComponent, MenuPopupComponent],
})
export class BarTitleComponent implements OnInit, OnDestroy {
  private readonly _ngDestroy: Subject<void>;
  private readonly _menuDropdownPositions: List<ConnectedPosition>;
  private _menuItems: List<PopupMenuItem>;
  private _isMenuShown: boolean;
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
      'select-none',
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
  
  set isMenuShown(value: boolean) {
    this._isMenuShown = value;
    this._CDR.detectChanges();
  }

  get isMenuShown(): boolean {
    return this._isMenuShown;
  }

  get title(): string | undefined {
    return this._title;
  }

  get menuItems(): List<PopupMenuItem> {
    return this._menuItems;
  }

  get menuDropdownPositions(): List<ConnectedPosition> {
    return this._menuDropdownPositions;
  }

  constructor(
    private readonly _IPC: InterProcessCommunicator,
    private readonly _titleService: TitleService,
    private readonly _CDR: ChangeDetectorRef,
    private readonly _eventBusService: EventBusService
  ) {
    this._blurred= this._isMenuShown = this._isMaximized  = false;
    this._menuItems = this._initMenuItems();
    this._ngDestroy = new Subject();
    this._isVisible = true;
    this._menuDropdownPositions = List([
      { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 5 },
    ]);
  }

  ngOnInit(): void {
    this._initStores();
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

  onMenuTriggerClick(): void {
    this.isMenuShown = true;
  }

  private _onCloseWorkspaceClick(): void {
    this._eventBusService.emit(
      new WorkspaceEvent({ message: WorkspaceEventMessages.CLOSE })
    );
  }

  private _onCloseEditorClick(): void {
    this._eventBusService.emit(
      new EditorEvent({ message: EditorEventMessages.CLOSE })
    );
  }

  private _onTitleChanges(title: string | undefined) {
    this._title = title;
    this._CDR.detectChanges();
  }

  private _onAppEvents(event: IAppEvent): void {
    if (event instanceof WorkspaceEvent && (event.message === WorkspaceEventMessages.OPEN || event.message === WorkspaceEventMessages.CLOSE)) {
      this._menuItems = this._menuItems.setIn(
        [1, 'disabled'],
        event.message ===  WorkspaceEventMessages.CLOSE
      );
    }

    if (event instanceof EditorEvent && (event.message === EditorEventMessages.OPEN || event.message === EditorEventMessages.CLOSE)) {
      this._menuItems = this._menuItems.setIn(
        [0, 'disabled'],
        event.message === EditorEventMessages.CLOSE
      );
    }

    this._CDR.detectChanges();
  }

  private _initStores(): void {
    const _register = Helper.makeObservableRegistrar.call(this, this._ngDestroy);


    _register(this._titleService.titleStore$, this._onTitleChanges);
    _register(this._eventBusService.appEvents$, this._onAppEvents);
  }

  private _initMenuItems(): List<PopupMenuItem> {
    return List([
      new PopupMenuItem({
        content: 'Close Editor',
        disabled: true,
        onClick: this._onCloseEditorClick.bind(this),
      }),
      new PopupMenuItem({
        content: 'Close Workspace',
        disabled: true,
        onClick: this._onCloseWorkspaceClick.bind(this),
      }),
      new PopupMenuItem({
        content: 'Close Window',
        onClick: this.onCloseControlClick.bind(this),
      }),
      new PopupMenuItem({ separator: true }),
      new PopupMenuItem({
        content: 'Exit',
        onClick: this.onCloseControlClick.bind(this),
      }),
    ]);
  }
}
