import { Component, Input, EventEmitter, Output, OnChanges, SimpleChanges, HostBinding, ChangeDetectorRef } from '@angular/core';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { OverlayscrollbarsModule } from 'overlayscrollbars-ngx';
import { ItemTabComponent } from '../item-tab/item-tab.component';
import { List, OrderedSet } from 'immutable';
import { CommonModule } from '@angular/common';
import { Package } from '@shared/models/package.model';

const imports = [
  CommonModule,
  ItemTabComponent,
  OverlayscrollbarsModule,
  DragDropModule,
];

@Component({
  selector: 'app-display-tab',
  templateUrl: './display-tab.component.html',
  styleUrls: ['./display-tab.component.scss'],
  standalone: true,
  imports,
})
export class DisplayTabComponent implements OnChanges {
  private _selectedPackage: Package | undefined;
  private _tabs: OrderedSet<Package>;
  private _tabSelectionOrder: List<Package>;

  @HostBinding('class')
  private get _classes(): string[] {
    return ['block', 'w-full', 'bg-slate-200', 'divide-x'];
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

    if (selectedPackage) {
      this._onSelectedPackageChange(selectedPackage.currentValue);
    }
  }

  onTabClick(pkg: Package): void {
    this._selectTab(pkg);
  }

  onTabClose(pkg: Package): void {
    const index = this._tabSelectionOrder.indexOf(pkg);

    this._tabs = this._tabs.remove(pkg);

    if (this._tabSelectionOrder.size - 1 === index) {
      this._tabSelectionOrder = this._tabSelectionOrder.pop();
      this._selectTab(this._tabSelectionOrder.last());

      return;
    }

    this._tabSelectionOrder = this._tabSelectionOrder.remove(index);
    this._CDR.detectChanges();
  }

  onTabDrop(event: CdkDragDrop<OrderedSet<Package>>): void {
    this._tabs = this._tabs
      .toList()
      .remove(event.previousIndex)
      .insert(event.currentIndex, event.item.data)
      .toOrderedSet();

    this._CDR.detectChanges();
  }

  //#region Private Handlers
  private _onSelectedPackageChange(pkg: Package | undefined): void {
    if (!pkg) {
      this._tabs = this._tabs.clear();
      this._tabSelectionOrder = this._tabSelectionOrder.clear();

      return;
    }

    this._tabs = this._tabs.add(pkg);
    this._tabSelectionOrder = this._setSelectionTabOrder(pkg, this._tabSelectionOrder);
  }
  //#endregion

  //#region Helper Methods
  private _selectTab(pkg: Package): void {
    this._selectedPackage = pkg;
    this.selectedPackageChange.emit(pkg);
  }

  private _setSelectionTabOrder(pkg: Package, collection: List<Package>) {
    const index = collection.indexOf(pkg);

    if (index > -1) {
      collection = collection.remove(index);
    }

    return collection.push(pkg);
  }
  //#endregion
}
