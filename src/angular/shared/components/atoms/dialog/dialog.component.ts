import { AfterViewInit, Component, EventEmitter, HostBinding, Input, OnChanges, Output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { Dialog, DialogModule, DialogRef } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [CommonModule, DialogModule],
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent implements OnChanges, AfterViewInit {
  @ViewChild('template')
  private readonly _template!: TemplateRef<unknown>;

  private _isShown: boolean;
  private _dialogRef: DialogRef<unknown> | undefined;

  @HostBinding('class')
  private get _classes(): string[] {
    return ['hidden'];
  }

  @Input()
  set isShown(value: boolean) {
    this._isShown = value;
  }

  get isShown(): boolean {
    return this._isShown;
  }

  @Output()
  close: EventEmitter<void>;

  constructor(private readonly _dialog: Dialog) {
    this._isShown = false;
    this.close = new EventEmitter();
  }

  ngAfterViewInit(): void {
    if (this._isShown) {
      this._open();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { isShown } = changes;

    if (isShown && typeof isShown.currentValue === 'boolean') {
      this._handleIsShownValueChange(isShown.currentValue);
    }
  }

  private _handleIsShownValueChange(isShown: boolean): void {
    if (isShown) {
      return this._open();
    }

    this._close();
  }

  private _open(): void {
    this._dialogRef = this._dialog.open(this._template, { disableClose: true });
    this._dialogRef.overlayRef.updatePosition();
  }

  private _close(): void {
    this.close.emit();
    this._dialogRef?.close();
  }
}
