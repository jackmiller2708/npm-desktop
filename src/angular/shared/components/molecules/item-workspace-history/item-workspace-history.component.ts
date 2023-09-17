import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { WorkspaceHistoryItemStateChanges } from './models/workspace-history-item.state-changes.model';
import { IWorkspaceHistoryItem } from './interfaces/workspace-history-item.interface';
import { PromptDialogComponent } from '../prompt-dialog/prompt-dialog.component';
import { WorkspaceHistoryItem } from './models/workspace-history-item.model';
import { MenuPopupComponent } from '../menu-popup/menu-popup.component';
import { ButtonComponent } from '../../atoms/button/button.component';
import { ProcessService } from '@services/process/process.service';
import { PopupMenuItem } from './../menu-popup/models/popup-menu-item.model';
import { TextComponent } from '../../atoms/text/text.component';
import { IconComponent } from '../../atoms/icon/icon.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { StateUpdateFn } from '@services/state/interfaces/state-changes.interface';
import { StateService } from '@services/state/state.service';
import { CommonModule } from '@angular/common';
import { MonadService } from '@services/monad/monad.service';
import { Workspace } from '@models/workspace.model';
import { Either } from '@services/monad/models/either.monad';
import { List } from 'immutable';

const imports = [CommonModule, OverlayModule, TextComponent, IconComponent, MenuPopupComponent, PromptDialogComponent, ButtonComponent];

@Component({
  selector: 'app-item-workspace-history',
  templateUrl: './item-workspace-history.component.html',
  styleUrls: ['./item-workspace-history.component.scss'],
  standalone: true,
  imports,
})
export class ItemWorkspaceHistoryComponent implements AfterViewInit {
  private _states: WorkspaceHistoryItem;
  private _isPromptShown: boolean;
  private _isReady: boolean;

  private _dialogConfirm: | ((value: boolean | PromiseLike<boolean>) => void) | undefined;
  private _dialogReject: ((reason?: any) => void) | undefined;

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

  get menuItems(): List<PopupMenuItem> {
    return this._states.menuItems;
  }

  get isPromptShown(): boolean {
    return this._isPromptShown;
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
    private readonly _monadService: MonadService,
    private readonly _processService: ProcessService,
    private readonly _stateService: StateService,
    private readonly _CDR: ChangeDetectorRef
  ) {
    this._states = this._init();
    this._isReady = this._isPromptShown = false;

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

  onInputKeyDown(event: KeyboardEvent): void {
    if (event.key !== 'Enter' && event.key !== 'Escape') {
      return;
    }

    // Cancels editing
    if (event.key === 'Escape') {
      return this._applyUpdatesAndDetectChanges('isEditing', () => false);
    }

    const { value } = event.target as HTMLInputElement;

    this._applyUpdatesAndDetectChanges('dataSource', (dataSource: any) => (dataSource as Workspace).set('name', value));
    this._applyUpdatesAndDetectChanges('isEditing', () => false);
  }

  onPromptConfirm(value: boolean): void {
    if (!this._dialogConfirm) {
      return;
    }

    this._dialogConfirm(value);
    this._dialogConfirm = undefined;
  }

  onPromptReject(): void {
    if (!this._dialogReject) {
      return;
    }

    this._dialogReject('Dialog closed');
    this._dialogReject = undefined;
    this._isPromptShown = false;
    this._CDR.detectChanges();
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

  private async _onRemoveOptionClick(): Promise<void> {
    (await this._showConfirmationPrompt()).fold<void>(
      (reason: string): void => void reason,
      (result: boolean) => {
        if (result) {
          this.remove.emit(this._states.dataSource);
        }
      }
    );

    this._isPromptShown = false;
    this._CDR.detectChanges();
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
    
    if (this._isReady) {
      this._CDR.detectChanges();
    }
  }

  /**
   * Updates state changes and emits state changes and returns updated state.
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

  /**
   * Shows confirmation popup and returns the confirmation result.
   */
  private async _showConfirmationPrompt(): Promise<Either<string, boolean>> {
    try {
      const result = await new Promise<boolean>((resolve, reject) => {
        this._isPromptShown = true;
        this._dialogConfirm = resolve;
        this._dialogReject = reject;
        this._CDR.detectChanges();
      });

      return this._monadService.either().right(result);
    } catch (err) {
      return this._monadService.either().left(err as string);
    }
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
        new PopupMenuItem({
          content: 'Show in Explorer',
          onClick: this._onShowInExplrOPtionClick.bind(this),
        }),
        new PopupMenuItem({
          content: 'Copy path',
          onClick: this._onCopyPathOptionClick.bind(this),
        }),
        new PopupMenuItem({ separator: true }),
        new PopupMenuItem({
          content: 'Rename...',
          onClick: this._onRenameMenuOptionClick.bind(this),
        }),
        new PopupMenuItem({
          content: 'Remove from Recents...',
          className: 'font-medium text-red-500 hover:!bg-red-100',
          onClick: this._onRemoveOptionClick.bind(this),
        }),
      ]),
    });
  }
}
