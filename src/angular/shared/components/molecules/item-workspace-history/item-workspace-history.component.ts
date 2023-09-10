import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Workspace } from 'src/angular/shared/models/workspace.model';
import { TextComponent } from '../../atoms/text/text.component';

@Component({
  selector: 'app-item-workspace-history',
  standalone: true,
  imports: [CommonModule, TextComponent],
  templateUrl: './item-workspace-history.component.html',
  styleUrls: ['./item-workspace-history.component.scss'],
})
export class ItemWorkspaceHistoryComponent {
  @Input() dataSource: Workspace | undefined;

  @Output() selected: EventEmitter<Workspace>;

  constructor() {
    this.selected = new EventEmitter();
  }

  onSelectedTriggered(): void {
    this.selected.emit(this.dataSource);
  }
}
