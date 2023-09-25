import { Component, HostBinding, Input } from '@angular/core';
import { IconComponent } from '@shared/components/atoms/icon/icon.component';
import { CommonModule } from '@angular/common';
import { Package } from '@shared/models/package.model';

const CHECK_PATH = "M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z";
const XMARK_PATH = "M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z";

@Component({
  selector: 'app-item-package',
  templateUrl: './item-package.component.html',
  styleUrls: ['./item-package.component.scss'],
  standalone: true,
  imports: [CommonModule, IconComponent],
})
export class ItemPackageComponent {
  private _package: Package | undefined;

  @HostBinding('class')
  private get _classes(): string[] {
    return [
      'flex',
      'gap-3',
      'justify-between',
      'items-center',
      'cursor-pointer',
      'hover:bg-slate-300',
      'px-2',
      'py-1',
      'rounded-sm',
      'transition-colors',
      'duration-100',
      'select-none'
    ];
  }

  @Input()
  set dataSource(value: Package) {
    this._package = value;
  }

  get dataSource(): Package | undefined {
    return this._package;
  }

  get iconPath(): string {
    return this._package?.path ? CHECK_PATH : XMARK_PATH;
  }
}
