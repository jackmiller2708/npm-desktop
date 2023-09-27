import { Component, Input, EventEmitter, Output, OnChanges, SimpleChanges, HostBinding, ChangeDetectorRef } from '@angular/core';
import { ItemTabComponent } from '../item-tab/item-tab.component';
import { List, OrderedSet } from 'immutable';
import { CommonModule } from '@angular/common';
import { Package } from '@shared/models/package.model';

@Component({
  selector: 'app-display-tab',
  templateUrl: './display-tab.component.html',
  styleUrls: ['./display-tab.component.scss'],
  standalone: true,
  imports: [CommonModule, ItemTabComponent],
})
export class DisplayTabComponent implements OnChanges {
  private _selectedPackage: Package | undefined;
  private _tabs: OrderedSet<Package>;
  private _tabSelectionOrder: List<Package>;

  @HostBinding('class')
  private get _classes(): string[] {
    return ['flex', 'bg-slate-200'];
  }

  @Input()
  set selectedPackage(value: Package | undefined) {
    this._selectedPackage = value;
  }

  get selectedPackage(): Package | undefined {
    return this._selectedPackage;
  }

  get tabs(): OrderedSet<Package> {
    return this._tabs;
  }

  @Output()
  readonly selectedPackageChange: EventEmitter<Package>;

  constructor(private readonly _CDR: ChangeDetectorRef) {
    this.selectedPackageChange = new EventEmitter();
    this._tabSelectionOrder = List();
    this._tabs = OrderedSet();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { selectedPackage } = changes;

    if (selectedPackage && selectedPackage.currentValue) {
      this._onSelectedPackageChange(selectedPackage.currentValue);
    }
  }

  onTabClick(pkg: Package): void {
    this._selectTab(pkg);
  }

  onTabClose(pkg: Package): void {
    this._tabs = this._tabs.remove(pkg);

    if (this._tabSelectionOrder.last() === pkg) {
      this._tabSelectionOrder = this._tabSelectionOrder.pop();
      this._selectTab(this._tabSelectionOrder.last());

      return;
    }

    this._tabSelectionOrder = this._tabSelectionOrder.remove(
      this._tabSelectionOrder.indexOf(pkg)
    );
    this._CDR.detectChanges();
  }

  private _selectTab(pkg: Package): void {
    this._selectedPackage = pkg;
    this.selectedPackageChange.emit(pkg);
  }

  private _onSelectedPackageChange(pkg: Package): void {
    this._tabs = this._tabs.add(pkg);
    this._tabSelectionOrder = this._setSelectionTabOrder(pkg, this._tabSelectionOrder);
  }

  private _setSelectionTabOrder(pkg: Package, collection: List<Package>) {
    const index = collection.indexOf(pkg);

    if (index > -1) {
      collection = collection.remove(index);
    }

    return collection.push(pkg);
  }
}
