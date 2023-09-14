import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { PopupMenuStateChanges } from './models/popup-menu-state-changes.model';
import { ConnectedPosition } from '@angular/cdk/overlay';
import { IPopupMenuProps } from './interfaces/popup-menu-props.interface';
import { PopupMenuProps } from './models/popup-menu-props.interface';
import { PopupComponent } from '../../atoms/popup/popup.component';
import { StateUpdateFn } from 'src/angular/shared/services/state/interfaces/state-changes.interface';
import { IconComponent } from '../../atoms/icon/icon.component';
import { TextComponent } from '../../atoms/text/text.component';
import { PopupMenuItem } from './models/popup-menu-item.model';
import { CommonModule } from '@angular/common';
import { StateService } from 'src/angular/shared/services/state/state.service';
import { List } from 'immutable';

@Component({
  selector: 'app-menu-popup',
  standalone: true,
  imports: [CommonModule, PopupComponent, IconComponent, TextComponent],
  templateUrl: './menu-popup.component.html',
  styleUrls: ['./menu-popup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuPopupComponent implements AfterViewInit {
  private readonly _dropdownPosition: List<ConnectedPosition>;
  private _isReady: boolean;
  private _states: PopupMenuProps;

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
  set dataSource(value: List<PopupMenuItem> | undefined) {
    this._applyUpdatesAndDetectChanges('dataSource', () => value);
  }

  get dataSource(): List<PopupMenuItem> | undefined {
    return this._states.dataSource;
  }

  @Input()
  set isShown(value: boolean) {
    this._applyUpdatesAndDetectChanges('isShown', () => value);
  }

  get isShown(): boolean {
    return this._states.isShown;
  }

  get dropdownPositions(): ConnectedPosition[] {
    return this._dropdownPosition.toArray();
  }

  @Output()
  isShownChange: EventEmitter<boolean>;

  @Output()
  stateChanged: EventEmitter<PopupMenuStateChanges>;

  constructor(
    private readonly _stateService: StateService,
    private readonly _CDR: ChangeDetectorRef
  ) {
    this._isReady = false;
    this._states = this._init();
    this._dropdownPosition = List([
      { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top' },
      { originX: 'end', originY: 'top', overlayX: 'end', overlayY: 'bottom' },
    ]);

    this.isShownChange = new EventEmitter();
    this.stateChanged = new EventEmitter();
  }

  onItemClick(handlerFn: () => void): void {
    handlerFn();
    this.isShownChange.emit(false);
  }

  ngAfterViewInit(): void {
    this._isReady = true;
  }

  private _applyUpdatesAndDetectChanges(key: keyof IPopupMenuProps, updater: StateUpdateFn<IPopupMenuProps>): void {
    this._states = this._updateStateAndEmitChanges(this._states, key, updater);
    this._CDR.detectChanges();
  }

  private _updateStateAndEmitChanges(states: PopupMenuProps, key: keyof IPopupMenuProps, updater: StateUpdateFn<IPopupMenuProps>): PopupMenuProps {
    const [currentState] = this._stateService
      .updateState<IPopupMenuProps>(states, key, updater)
      .map(this._emitStateChanges.bind(this))
      .run();

    return currentState;
  }

  private _emitStateChanges([oldState, currentState]: PopupMenuProps[]): PopupMenuProps {
    if (this._isReady && oldState !== currentState) {
      this.stateChanged.emit(new PopupMenuStateChanges({ oldState, currentState }));
    }

    return currentState;
  }

  private _init(): PopupMenuProps {
    return new PopupMenuProps();
  }
}
