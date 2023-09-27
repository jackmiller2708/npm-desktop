import { Component, Input, EventEmitter, Output, HostBinding } from '@angular/core';
import { DetailsPackageComponent } from '@shared/components/molecules/details-package/details-package.component';
import { DisplayTabComponent } from '@shared/components/molecules/display-tab/display-tab.component';
import { CommonModule } from '@angular/common';
import { Package } from '@shared/models/package.model';

@Component({
  selector: 'app-package-viewer',
  templateUrl: './package-viewer.component.html',
  styleUrls: ['./package-viewer.component.scss'],
  imports: [CommonModule, DisplayTabComponent, DetailsPackageComponent],
  standalone: true,
})
export class PackageViewerComponent {
  private _selectedPackage: Package | undefined;

  @HostBinding('class')
  private get _classes(): string[] {
    return ['block', 'w-full', 'h-full'];
  }

  @Input()
  set selectedPackage(value: Package | undefined) {
    this._selectedPackage = value;
  }

  get selectedPackage(): Package | undefined {
    return this._selectedPackage;
  }

  @Output()
  readonly selectedPackageChange: EventEmitter<Package>;

  constructor() {
    this.selectedPackageChange = new EventEmitter();
  }

  onTabSelectionChange(pkg: Package): void {
    this._selectedPackage = pkg;
    this.selectedPackageChange.emit(pkg);
  }
}
