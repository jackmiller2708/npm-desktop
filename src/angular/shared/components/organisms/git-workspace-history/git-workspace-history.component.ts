import { Component, HostBinding } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-git-workspace-history',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './git-workspace-history.component.html',
  styleUrls: ['./git-workspace-history.component.scss'],
})
export class GitWorkspaceHistoryComponent {
  @HostBinding('class')
  private get _classes(): string[] {
    return ['flex', 'items-center', 'justify-center'];
  }
}
