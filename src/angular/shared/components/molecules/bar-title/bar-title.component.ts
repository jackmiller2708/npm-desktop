import { Component, HostBinding, Input } from '@angular/core';
import { IconComponent } from '@shared/components/atoms/icon/icon.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bar-title',
  templateUrl: './bar-title.component.html',
  styleUrls: ['./bar-title.component.scss'],
  standalone: true,
  imports: [CommonModule, IconComponent],
})
export class BarTitleComponent {
  private _blurred: boolean;
  private _isMaximized: boolean;

  @HostBinding('class')
  private get _classes(): string[] {
    return [
      'flex',
      'justify-between',
      'items-center',
      'w-screen',
      'h-7',
      this._blurred ? 'bg-gray-900' : 'bg-black',
      'pl-2',
    ];
  }

  @Input()
  set blurred(value: boolean) {
    this._blurred = value;
  }

  @Input()
  set isMaximized(value: boolean) {
    this._isMaximized = value;
  }

  get isMaximized(): boolean {
    return this._isMaximized;
  }

  constructor() {
    this._blurred = false;
    this._isMaximized = false;
  }
}
