import { Component, HostBinding, Input } from '@angular/core';
import { ItemNavComponent } from '../item-nav/item-nav.component';
import { IconComponent } from '../../atoms/icon/icon.component';
import { TextComponent } from '../../atoms/text/text.component';
import { CommonModule } from '@angular/common';
import { NavItem } from '../item-nav/models/nav-item.model';

@Component({
  selector: 'app-nav-vertical',
  standalone: true,
  imports: [CommonModule, ItemNavComponent, IconComponent, TextComponent],
  templateUrl: './nav-vertical.component.html',
  styleUrls: ['./nav-vertical.component.scss'],
})
export class NavVerticalComponent {
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
