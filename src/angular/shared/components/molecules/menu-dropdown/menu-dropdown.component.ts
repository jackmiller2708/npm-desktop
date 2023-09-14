import { Component, HostBinding, Input, Output, EventEmitter } from '@angular/core';
import { ConnectedPosition } from '@angular/cdk/overlay';
import { PopupComponent } from '../../atoms/popup/popup.component';
import { TextComponent } from '../../atoms/text/text.component';
import { IconComponent } from '../../atoms/icon/icon.component';
import { CommonModule } from '@angular/common';
import { MenuItem } from './models/menu-item.model';
import { List } from 'immutable';

@Component({
  selector: 'app-menu-dropdown',
  standalone: true,
  imports: [CommonModule, TextComponent, IconComponent, PopupComponent],
  templateUrl: './menu-dropdown.component.html',
  styleUrls: ['./menu-dropdown.component.scss'],
})
export class MenuDropdownComponent {
  private _isShown: boolean;
  private _dropdownPosition: ConnectedPosition[];

  @Input() dataSource: List<MenuItem> | undefined;
  @Input() target: Element | undefined;

  @Input() set shown(value: boolean) {
    this._isShown = value;
  }

  @HostBinding('class')
  private get _classes(): string[] {
    return ['absolute'];
  }

  get isShown(): boolean {
    return this._isShown;
  }

  get dropdownPositions(): ConnectedPosition[] {
    return this._dropdownPosition;
  }

  @Output() shownChange: EventEmitter<boolean>;

  constructor() {
    this.shownChange = new EventEmitter();
    
    this._isShown = false;
    this._dropdownPosition = [
      { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top' },
      { originX: 'end', originY: 'top', overlayX: 'end', overlayY: 'bottom' },
    ];
  }

  onItemClick(handlerFn: () => void): void {
    handlerFn();
    this.shownChange.emit(false);
  }
}
