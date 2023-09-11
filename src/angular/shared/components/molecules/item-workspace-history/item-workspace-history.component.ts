import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MenuDropdownComponent } from '../menu-dropdown/menu-dropdown.component';
import { WorkspaceHistoryItem } from './models/workspace-history-item.model';
import { TextComponent } from '../../atoms/text/text.component';
import { IconComponent } from '../../atoms/icon/icon.component';
import { OverlayModule } from '@angular/cdk/overlay';
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
    this._detectChangesAndEmitState(
      this._states,
      (this._states = this._states.set('dataSource', value))
    );
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
    this._detectChangesAndEmitState(
      this._states,
      (this._states = this._states.set('isMenuShown', value))
    );
  }

  get menuItems(): List<MenuItem> {
    return this._states.menuItems;
  }

  @Output()
  ready: EventEmitter<WorkspaceHistoryItem>;

  @Output()
  selected: EventEmitter<Workspace>;

  @Output()
  stateChanged: EventEmitter<{ oldState: WorkspaceHistoryItem; currentState: WorkspaceHistoryItem; }>;

  constructor(private readonly _CDR: ChangeDetectorRef) {
    this._states = this._init();
    this._isReady = false;

    this.ready = new EventEmitter();
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
      this._detectChangesAndEmitState(
        this._states,
        (this._states = this._states.set('isMenuShown', true))
      );
    }
  }

  private _enableEditMode(): void {
    this._detectChangesAndEmitState(
      this._states,
      (this._states = this._states.set('isEditing', true))
    );
    this._input.nativeElement.focus();
  }

  private _detectChangesAndEmitState(oldState: WorkspaceHistoryItem, currentState: WorkspaceHistoryItem): void {
    if (this._isReady && oldState !== currentState) {
      this.stateChanged.emit({ oldState, currentState });
    }

    this._CDR.detectChanges();
  }

  private _init(): WorkspaceHistoryItem {
    return new WorkspaceHistoryItem({
      menuItems: List([
        new MenuItem({
          content: 'Show in Explorer',
        }),
        new MenuItem({
          content: 'Copy path',
        }),
        new MenuItem({ separator: true }),
        new MenuItem({
          content: 'Rename...',
          onClick: this._enableEditMode.bind(this),
        }),
        new MenuItem({
          content: 'Remove from Recents...',
          className: 'font-medium text-red-500 hover:!bg-red-100',
        }),
      ]),
    });
  }
}
