import { Component, HostBinding, Input } from '@angular/core';
import { NavItemComponent } from '../nav-item/nav-item.component';
import { IconComponent } from '../../atoms/icon/icon.component';
import { TextComponent } from '../../atoms/text/text.component';
import { CommonModule } from '@angular/common';
import { NavItem } from '../nav-item/models/nav-item.model';

@Component({
  selector: 'app-vertical-nav',
  standalone: true,
  imports: [CommonModule, NavItemComponent, IconComponent, TextComponent],
  templateUrl: './vertical-nav.component.html',
  styleUrls: ['./vertical-nav.component.scss'],
})
export class VerticalNavComponent {
  @Input() dataSource: NavItem[];
  @Input() className: string;

  @HostBinding('class')
  private get _classes(): string[] {
    return ([] as string[]).concat(this.className.split(' '));
  }

  constructor() {
    this.dataSource = [];
    this.className = '';
  }
}
