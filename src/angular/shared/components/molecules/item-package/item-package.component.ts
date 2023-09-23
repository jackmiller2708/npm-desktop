import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Package } from '@shared/models/package.model';

@Component({
  selector: 'app-item-package',
  templateUrl: './item-package.component.html',
  styleUrls: ['./item-package.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class ItemPackageComponent {
  private _package: Package | undefined;

  @Input()
  set dataSource(value: Package) {
    this._package = value;
  }

  get dataSource(): Package | undefined {
    return this._package;
  }
}
