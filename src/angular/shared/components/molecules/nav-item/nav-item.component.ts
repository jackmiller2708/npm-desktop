import { Component, Input, TemplateRef } from '@angular/core';
import { IconComponent } from '../../atoms/icon/icon.component';
import { TextComponent } from '../../atoms/text/text.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavItem } from './models/nav-item.model';

@Component({
  selector: 'app-nav-item',
  standalone: true,
  imports: [CommonModule, RouterModule, IconComponent, TextComponent],
  templateUrl: './nav-item.component.html',
  styleUrls: ['./nav-item.component.scss'],
})
export class NavItemComponent {
  @Input() content: TemplateRef<any> | undefined;
  @Input() item: NavItem | undefined;
  @Input() className: string;

  constructor() {
    this.className = '';
  }
}
