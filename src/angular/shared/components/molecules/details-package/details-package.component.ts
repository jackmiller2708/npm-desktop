import { Component, HostBinding, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Package } from '@shared/models/package.model';

@Component({
  selector: 'app-details-package',
  templateUrl: './details-package.component.html',
  styleUrls: ['./details-package.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class DetailsPackageComponent {
  private _package: Package | undefined;

  @HostBinding('class')
  private get _classes(): string[] {
    return ['h-full', 'w-full'];
  }

  @Input()
  set dataSource(value: Package | undefined) {
    this._package = value;
  }

  get dataSource(): Package | undefined {
    return this._package;
  }
}
