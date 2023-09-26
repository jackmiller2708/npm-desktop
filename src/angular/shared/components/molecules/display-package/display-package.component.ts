import { Component, HostBinding, Input, ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { ItemPackageComponent } from '../item-package/item-package.component';
import { CommonModule } from '@angular/common';
import { Package } from '@shared/models/package.model';
import { Map } from 'immutable';

@Component({
  selector: 'app-display-package',
  templateUrl: './display-package.component.html',
  styleUrls: ['./display-package.component.scss'],
  standalone: true,
  imports: [CommonModule, ItemPackageComponent],
})
export class DisplayPackageComponent {
  private _selectedPackage: Package | undefined;
  private _dataSource: Map<string, Package> | undefined;
  private _name: string | undefined;

  @HostBinding('class')
  private get _classes(): string[] {
    return ['relative'];
  }

  @Input()
  set dataSource(value: Map<string, Package>) {
    this._dataSource = value;
  }

  get dataSource(): Map<string, Package> | undefined {
    return this._dataSource;
  }

  @Input()
  set name(value: string) {
    this._name = value;
  }

  get name(): string | undefined {
    return this._name;
  }

  get packageCount(): number {
    return this._dataSource?.size ?? 0;
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

  constructor(private readonly _CDR: ChangeDetectorRef) {
    this.selectedPackageChange = new EventEmitter();
  }

  packageIdentity(_: number, [, dependency]: [string, Package]): Package {
    return dependency;
  }

  onPackageClick(pkg: Package): void {
    this._selectedPackage = pkg;
    this.selectedPackageChange.emit(pkg);
    this._CDR.detectChanges();
  }
}
