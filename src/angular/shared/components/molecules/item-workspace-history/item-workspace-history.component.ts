import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TextComponent } from '../../atoms/text/text.component';
import { IconComponent } from '../../atoms/icon/icon.component';
import { CommonModule } from '@angular/common';
import { Workspace } from 'src/angular/shared/models/workspace.model';

@Component({
  selector: 'app-item-workspace-history',
  standalone: true,
  imports: [CommonModule, TextComponent, IconComponent],
  templateUrl: './item-workspace-history.component.html',
  styleUrls: ['./item-workspace-history.component.scss'],
})
export class ItemWorkspaceHistoryComponent {
  private _editEnabled: boolean;

  @Input() dataSource: Workspace | undefined;
  @Output() selected: EventEmitter<Workspace>;

  get editEnabled(): boolean {
    return this._editEnabled;
  }

  constructor() {
    this._editEnabled = false;
    this.selected = new EventEmitter();
  }

  onSelectedTriggered(): void {
    this.selected.emit(this.dataSource);
  }
}
