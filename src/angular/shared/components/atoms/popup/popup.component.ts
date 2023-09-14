import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, HostBinding, Input, Output, ViewChild } from '@angular/core';
import { CdkConnectedOverlay, ConnectedPosition, OverlayModule } from '@angular/cdk/overlay';
import { PopupStateChanges } from './models/popup-state-changes.model';
import { StateUpdateFn } from 'src/angular/shared/services/state/interfaces/state-changes.interface';
import { CommonModule } from '@angular/common';
import { StateService } from 'src/angular/shared/services/state/state.service';
import { IPopupProps } from './interfaces/popup-props.interface';
import { PopupProps } from './models/popup-props.model';

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [CommonModule, OverlayModule],
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PopupComponent {
  @ViewChild(CdkConnectedOverlay)
  private readonly _overlay!: CdkConnectedOverlay;
  
  private _isReady: boolean;
  private _states: PopupProps;

  @HostBinding('class')
  private get _classes(): string[] {
    return ['absolute'];
  }

  @Input()
  set target(value: Element | undefined) {
    this._applyUpdatesAndDetectChanges('target', () => value);
  }

  get target(): Element | undefined {
    return this._states.target;
  }

  @Input()
  set isShown(value: boolean) {
    this._applyUpdatesAndDetectChanges('isShown', () => value);
  }

  get isShown(): boolean {
    return this._states.isShown;
  }

  @Input()
  set dropdownPositions(value: ConnectedPosition[]) {
    this._applyUpdatesAndDetectChanges('dropdownPositions', () => value);
  }

  get dropdownPositions(): ConnectedPosition[] {
    return this._states.dropdownPositions;
  }

  @Output() 
  outsideClick: EventEmitter<void>;

  @Output()
  stateChanged: EventEmitter<PopupStateChanges>;

  @Output()
  ready: EventEmitter<PopupProps>;

  constructor(
    private readonly _stateService: StateService,
    private readonly _CDR: ChangeDetectorRef
  ) {
    this._states = this._init();
    this._isReady = false;

    this.outsideClick = new EventEmitter();
    this.stateChanged = new EventEmitter();
    this.ready = new EventEmitter();
  }

  onAttach(): void {
    this._overlay.overlayRef.updatePosition();
  }

  private _applyUpdatesAndDetectChanges(key: keyof IPopupProps, updater: StateUpdateFn<IPopupProps>): void {
    this._states = this._updateStateAndEmitChanges(this._states, key, updater);
    this._CDR.detectChanges();
  }

  private _updateStateAndEmitChanges(states: PopupProps, key: keyof IPopupProps, updater: StateUpdateFn<IPopupProps>): PopupProps {
    const [currentState] = this._stateService
      .updateState<IPopupProps>(states, key, updater)
      .map(this._emitStateChanges.bind(this))
      .run();

    return currentState;
  }

  private _emitStateChanges([oldState, currentState]: PopupProps[]): PopupProps {
    if (this._isReady && oldState !== currentState) {
      this.stateChanged.emit(new PopupStateChanges({ oldState, currentState }));
    }

    return currentState;
  }

  private _init(): PopupProps {
    return new PopupProps();
  }
}
