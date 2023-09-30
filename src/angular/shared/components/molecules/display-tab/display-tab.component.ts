import { Component, Input, EventEmitter, Output, OnChanges, SimpleChanges, HostBinding, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { EditorEvent, EditorEventMessages, WorkspaceEvent, WorkspaceEventMessages } from '@shared/models/event.model';
import { List, Map, OrderedMap, OrderedSet } from 'immutable';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { OverlayscrollbarsModule } from 'overlayscrollbars-ngx';
import { ItemTabComponent } from '../item-tab/item-tab.component';
import { EventBusService } from '@shared/services/event-bus/event-bus.service';
import { CommonModule } from '@angular/common';
import { IAppEvent } from '@shared/interfaces/event.interface';
import { Package } from '@shared/models/package.model';
import { Subject } from 'rxjs';
import { Helper } from '@shared/helper.class';

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
export class DisplayTabComponent implements OnInit, OnChanges, OnDestroy {
  private readonly _ngDestroy: Subject<void>;
  private _selectedPackage: Package | undefined;
  private _tabs: OrderedSet<Package>;
  private _tabSelectionOrder: List<Package>;
  private _deletedPackages: List<Package>;

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

  get deletedPackages(): List<Package> {
    return this._deletedPackages;
  }

  @Output()
  readonly selectedPackageChange: EventEmitter<Package>;

  constructor(
    private readonly _CDR: ChangeDetectorRef,
    private readonly _eventBusService: EventBusService
  ) {
    this.selectedPackageChange = new EventEmitter();
    this._tabSelectionOrder = this._deletedPackages = List();
    this._ngDestroy = new Subject();
    this._tabs = OrderedSet();
  }

  ngOnInit(): void {
    Helper.makeObservableRegistrar.call(this, this._ngDestroy)(
      this._eventBusService.appEvents$,
      (event: IAppEvent) => {
        if (event instanceof EditorEvent && event.message === EditorEventMessages.CLOSE) {
          this.onTabClose(this._selectedPackage!);
        }

        if (event instanceof WorkspaceEvent && event.message === WorkspaceEventMessages.OPEN && this._tabs.size) {
          this._onWorkspacePackagesLoaded(event.data);
        }
      }
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { selectedPackage } = changes;

    if (selectedPackage) {
      this._onSelectedPackageChange(selectedPackage.currentValue);
    }
  }

  ngOnDestroy(): void {
    this._ngDestroy.next();
  }

  onTabClick(pkg: Package): void {
    this._selectTab(pkg);
  }

  onTabClose(pkg: Package): void {
    const index = this._tabSelectionOrder.indexOf(pkg);

    this._tabs = this._tabs.remove(pkg);

    if (!this._tabs.size) {
      this._eventBusService.emit(new EditorEvent({ message: EditorEventMessages.EXIT }));
    }

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
      this._eventBusService.emit(new EditorEvent({ message: EditorEventMessages.EXIT }));

      return;
    }

    this._tabs = this._tabs.add(pkg);
    this._tabSelectionOrder = this._setSelectionTabOrder(pkg, this._tabSelectionOrder);

    if (this._tabs.size === 1) {
      this._eventBusService.emit(new EditorEvent({ message: EditorEventMessages.OPEN }));
    }
  }

  private _onWorkspacePackagesLoaded(packages: Map<string, Package>): void {
    const keys = packages.keySeq();

    let tabsMap = this._getTabsMap();
    let tabOrders = this._tabSelectionOrder;
    let deletedPackages = List<Package>();
    let selectedPackage = this._selectedPackage;

    for (const pkg of this._tabs) {
      if (keys.includes(pkg.name)) {
        const orderIndex = tabOrders.indexOf(pkg);
        const newPkgRef = packages.get(pkg.name)!;

        selectedPackage = selectedPackage === pkg ? newPkgRef : selectedPackage;
        tabsMap = tabsMap.set(pkg.name, newPkgRef);
        tabOrders = tabOrders.splice(orderIndex, 1, newPkgRef);
        continue;
      }

      deletedPackages = deletedPackages.push(pkg);
    }

    this._deletedPackages = deletedPackages;
    this._tabs = tabsMap.toOrderedSet();
    this._tabSelectionOrder = tabOrders;
    this._selectTab(selectedPackage!);
    this._CDR.detectChanges();
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

  private _getTabsMap(): OrderedMap<string, Package> {
    let _map = OrderedMap<string, Package>();

    for (const pkg of this._tabs) {
      _map = _map.set(pkg.name, pkg);
    }

    return _map;
  }
  //#endregion
}
