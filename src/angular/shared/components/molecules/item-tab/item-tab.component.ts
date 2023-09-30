import { Component, HostBinding, Input, HostListener, EventEmitter, Output, ElementRef, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { IconComponent } from '@shared/components/atoms/icon/icon.component';
import { CommonModule } from '@angular/common';
import { Package } from '@shared/models/package.model';

@Component({
  selector: 'app-item-tab',
  templateUrl: './item-tab.component.html',
  styleUrls: ['./item-tab.component.scss'],
  standalone: true,
  imports: [CommonModule, IconComponent],
})
export class ItemTabComponent implements AfterViewInit, OnChanges {
  private _package: Package | undefined;
  private _isSelected: boolean;
  private _isDeleted: boolean;

  @HostBinding('class')
  private get _classes(): string[] {
    const classes = [
      'flex',
      'items-center',
      'justify-between',
      'w-48',
      'py-1',
      'px-2',
      'hover:bg-slate-600',
      'cursor-pointer',
      'group',
      'select-none',
      'shrink-0',
    ]

    if (this._isSelected) {
      classes.push('selected');
    }

    if (this._isDeleted) {
      classes.push('line-through', 'deleted');
    }

    return classes;
  }

  @Input()
  set dataSource(value: Package) {
    this._package = value;
  }

  get dataSource(): Package | undefined {
    return this._package;
  }

  @Input()
  set isSelected(value: boolean) {
    this._isSelected = value;
  }

  get isSelected(): boolean {
    return this._isSelected;
  }

  @Input()
  set isDeleted(value: boolean) {
    this._isDeleted = value;
  }

  @Output()
  readonly onClick: EventEmitter<Package>;

  @Output()
  readonly onClose: EventEmitter<Package>;

  constructor(private readonly _elRef: ElementRef<HTMLElement>) {
    this._isSelected = this._isDeleted = false;
    this.onClick = new EventEmitter();
    this.onClose = new EventEmitter();
  }

  ngAfterViewInit(): void {
    this._elRef.nativeElement.scrollIntoView();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { isSelected } = changes;

    if (isSelected && isSelected.currentValue) {
      this._elRef.nativeElement.scrollIntoView();
    }
  }

  onCloseBtnClick(event: MouseEvent): void {
    event.stopPropagation();
    this.onClose.emit(this._package);
  }

  @HostListener('click')
  private _onSelfClick(): void {
    this.onClick.emit(this._package);
  }

  @HostListener('mousedown', ['$event'])
  private _onSelfMouseDown(event: MouseEvent): void {
    if (event.button !== 1) {
      return;
    }
    
    event.preventDefault();
    this.onClose.emit(this._package);
  }
}
