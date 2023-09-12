import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { WorkspaceHistoryItemStateChanges } from './models/workspace-history-item.state-changes.model';
import { MenuDropdownComponent } from '../menu-dropdown/menu-dropdown.component';
import { IWorkspaceHistoryItem } from './interfaces/workspace-history-item.interface';
import { WorkspaceHistoryItem } from './models/workspace-history-item.model';
import { ProcessService } from 'src/angular/shared/services/process/process.service';
import { TextComponent } from '../../atoms/text/text.component';
import { IconComponent } from '../../atoms/icon/icon.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { StateUpdateFn } from 'src/angular/shared/services/state/interfaces/state-changes.interface';
import { StateService } from 'src/angular/shared/services/state/state.service';
import { CommonModule } from '@angular/common';
import { Workspace } from 'src/angular/shared/models/workspace.model';
import { MenuItem } from '../menu-dropdown/models/menu-item.model';
import { List } from 'immutable';

@Component({
  selector: 'app-item-workspace-history',
  standalone: true,
  imports: [CommonModule, TextComponent, IconComponent, MenuDropdownComponent, OverlayModule],
  templateUrl: './item-workspace-history.component.html',
  styleUrls: ['./item-workspace-history.component.scss'],
})
export class ItemWorkspaceHistoryComponent implements AfterViewInit {
  private _states: WorkspaceHistoryItem;
  private _isReady: boolean;

  @ViewChild('inputEl')
  private readonly _input!: ElementRef<HTMLInputElement>;

  @Input()
  set state(value: WorkspaceHistoryItem | undefined) {
    this._states = value ?? this._states;
  }

  @Input()
  set dataSource(value: Workspace | undefined) {
    this._applyUpdatesAndDetectChanges('dataSource', () => value);
  }

  get dataSource(): Workspace | undefined {
    return this._states.dataSource;
  }

  get isEditing(): boolean {
    return this._states.isEditing;
  }

  get isMenuShown(): boolean {
    return this._states.isMenuShown;
  }

  set isMenuShown(value: boolean) {
    this._applyUpdatesAndDetectChanges('isMenuShown', () => value);
  }

  get menuItems(): List<MenuItem> {
    return this._states.menuItems;
  }

  @Output()
  ready: EventEmitter<WorkspaceHistoryItem>;

  @Output()
  selected: EventEmitter<Workspace>;

  @Output()
  remove: EventEmitter<Workspace>;

  @Output()
  stateChanged: EventEmitter<WorkspaceHistoryItemStateChanges>;

  constructor(
    private readonly _processService: ProcessService,
    private readonly _stateService: StateService,
    private readonly _CDR: ChangeDetectorRef,
  ) {
    this._states = this._init();
    this._isReady = false;

    this.ready = new EventEmitter();
    this.remove = new EventEmitter();
    this.selected = new EventEmitter();
    this.stateChanged = new EventEmitter();
  }

  ngAfterViewInit(): void {
    this._isReady = true;
    this.ready.emit(this._states);
  }

  onSelectedTriggered(): void {
    this.selected.emit(this.dataSource);
  }

  onDropdownBtnClick(): void {
    if (!this._states.isMenuShown) {
      this._applyUpdatesAndDetectChanges('isMenuShown', () => true);
    }
  }

  //#region Private Event Handlers
  // ===========================================================
  // ===========================================================
  private _onRenameMenuOptionClick(): void {
    this._applyUpdatesAndDetectChanges('isEditing', () => true);
    this._input.nativeElement.focus();
  }

  private _onShowInExplrOPtionClick(): void {
    this._processService
      .execute('start', ['""', `"${this._states.dataSource?.path}"`], { shell: true })
      .subscribe();
  }

  private _onCopyPathOptionClick(): void {
    this._processService
      .execute('echo|set', ['/p', '=', `"${this._states.dataSource?.path}"`, '|', 'clip'], { shell: true })
      .subscribe();
  }

  private _onRemoveOptionClick(): void {
    this.remove.emit(this._states.dataSource);
  }
  // ===========================================================
  // ===========================================================
  //#endregion

  //#region Helper Methods
  // ===========================================================
  // ===========================================================
  /**
   * Applies changes to the local `_state` prop and triggers the change detection cycle.
   */
  private _applyUpdatesAndDetectChanges(key: keyof IWorkspaceHistoryItem, updater: StateUpdateFn<IWorkspaceHistoryItem>): void {
    this._states = this._updateStateAndEmitChanges(this._states, key, updater);
    this._CDR.detectChanges();
  }

  /**
   * Updates state changes and emits state changes and return updated state.
   */
  private _updateStateAndEmitChanges(states: WorkspaceHistoryItem, key: keyof IWorkspaceHistoryItem, updater: StateUpdateFn<IWorkspaceHistoryItem>): WorkspaceHistoryItem {
    const [currentState] = this._stateService
      .updateState<IWorkspaceHistoryItem>(states, key, updater)
      .map(this._emitStateChanges.bind(this))
      .run();

    return currentState;
  }

  /**
   * Emits state changes when the component is ready and return the current state.
   */
  private _emitStateChanges([oldState, currentState]: WorkspaceHistoryItem[]): WorkspaceHistoryItem {
    if (this._isReady && oldState !== currentState) {
      this.stateChanged.emit(new WorkspaceHistoryItemStateChanges({ oldState, currentState }));
    }

    return currentState;
  }
  // ===========================================================
  // ===========================================================
  //#endregion

  /**
   * Initializes the default state.
   */
  private _init(): WorkspaceHistoryItem {
    return new WorkspaceHistoryItem({
      menuItems: List([
        new MenuItem({
          content: 'Show in Explorer',
          onClick: this._onShowInExplrOPtionClick.bind(this),
        }),
        new MenuItem({
          content: 'Copy path',
          onClick: this._onCopyPathOptionClick.bind(this),
        }),
        new MenuItem({ separator: true }),
        new MenuItem({
          content: 'Rename...',
          onClick: this._onRenameMenuOptionClick.bind(this),
        }),
        new MenuItem({
          content: 'Remove from Recents...',
          className: 'font-medium text-red-500 hover:!bg-red-100',
          onClick: this._onRemoveOptionClick.bind(this),
        }),
      ]),
    });
  }
}
