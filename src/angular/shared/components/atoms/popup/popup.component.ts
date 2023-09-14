import { Component, EventEmitter, HostBinding, Input, Output, ViewChild } from '@angular/core';
import { CdkConnectedOverlay, ConnectedPosition, OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [CommonModule, OverlayModule],
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss'],
})
export class PopupComponent {
  @ViewChild(CdkConnectedOverlay)
  private readonly _overlay!: CdkConnectedOverlay;

  private _isShown: boolean;
  private _target: Element | undefined;
  private _dropdownPositions: ConnectedPosition[];

  @HostBinding('class')
  private get _classes(): string[] {
    return ['absolute']
  }

  @Input()
  set target(value: Element | undefined) {
    this._target = value;
  }

  get target(): Element | undefined {
    return this._target;
  }

  @Input()
  set isShown(value: boolean) {
    this._isShown = value;
  }

  get isShown(): boolean {
    return this._isShown;
  }

  @Input()
  set dropdownPositions(value: ConnectedPosition[]) {
    this._dropdownPositions = value;
  }

  get dropdownPositions(): ConnectedPosition[] {
    return this._dropdownPositions;
  }

  @Output() outsideClick: EventEmitter<void>;

  constructor() {
    this.outsideClick = new EventEmitter();

    this._isShown = false;
    this._dropdownPositions = [];
  }

  onAttach(): void {
    this._overlay.overlayRef.updatePosition();
  }
}
