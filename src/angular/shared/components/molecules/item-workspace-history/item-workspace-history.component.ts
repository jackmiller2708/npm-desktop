import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { MenuDropdownComponent } from '../menu-dropdown/menu-dropdown.component';
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
export class ItemWorkspaceHistoryComponent {
  private _editEnabled: boolean;
  private _dropdownShown: boolean;
  private _dropdownMenuItems: List<MenuItem>

  @Input() dataSource: Workspace | undefined;

  private get _menuItems(): List<MenuItem> {
    return List([
      new MenuItem({
        content: 'Show in Explorer',
      }),
      new MenuItem({
        content: 'Copy path',
      }),
      new MenuItem({ separator: true }),
      new MenuItem({
        content: 'Rename...',
      }),
      new MenuItem({
        content: 'Remove from Recents...',
        className: 'font-medium text-red-500 hover:!bg-red-200'
      }),
    ]);
  }

  get editEnabled(): boolean {
    return this._editEnabled;
  }

  get isDropdownShown(): boolean {
    return this._dropdownShown;
  }

  set isDropdownShown(value: boolean) {
    this._dropdownShown = value;
    this._CDR.detectChanges();
  }

  get menuItems(): List<MenuItem> {
    return this._dropdownMenuItems;
  }

  @Output() selected: EventEmitter<Workspace>;

  constructor(private readonly _CDR: ChangeDetectorRef) {
    this._editEnabled = this._dropdownShown = false;
    this._dropdownMenuItems = this._menuItems;
    this.selected = new EventEmitter();
  }

  onSelectedTriggered(): void {
    this.selected.emit(this.dataSource);
  }

  onDropdownBtnClick(): void {
    if (!this._dropdownShown) {
      this._dropdownShown = true;
      this._CDR.detectChanges();
    }
  }
}
