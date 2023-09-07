import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NavItemComponent } from '../nav-item/nav-item.component';
import { IconComponent } from '../../atoms/icon/icon.component';
import { TextComponent } from '../../atoms/text/text.component';

@Component({
  selector: 'app-vertical-nav',
  standalone: true,
  imports: [CommonModule, NavItemComponent, IconComponent, TextComponent],
  templateUrl: './vertical-nav.component.html',
  styleUrls: ['./vertical-nav.component.scss'],
})
export class VerticalNavComponent {
  @Input() dataSource: any[];
  @Input() className: string;

  constructor() {
    this.dataSource = [];
    this.className = '';
  }
}
