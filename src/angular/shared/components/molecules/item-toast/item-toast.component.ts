import { Component, EventEmitter, Output, AfterViewInit, ChangeDetectorRef, Input, HostBinding, ElementRef } from '@angular/core';
import { IToastAction, IToastItemProps } from './interfaces/toast-item-props.interface';
import { ToastItemStateChanges } from './models/toast-item-state-changes.model';
import { ButtonComponent } from '../../atoms/button/button.component';
import { ToastItemProps } from './models/toast-item-props.model';
import { StateUpdateFn } from '@services/state/interfaces/state-changes.interface';
import { IconComponent } from '../../atoms/icon/icon.component';
import { TextComponent } from '../../atoms/text/text.component';
import { StateService } from '@services/state/state.service';
import { CommonModule } from '@angular/common';
import { Map } from 'immutable';

@Component({
  selector: 'app-item-toast',
  standalone: true,
  imports: [CommonModule, IconComponent, TextComponent, ButtonComponent],
  templateUrl: './item-toast.component.html',
  styleUrls: ['./item-toast.component.scss'],
})
export class ItemToastComponent implements AfterViewInit {
  private _states: ToastItemProps;
  private _isReady: boolean;
  private _iconPaths: Map<typeof this._states.variant, string>;

  @HostBinding('class')
  private get _classes(): string[] {
    return ['flex', 'items-start', 'rounded-md', 'shadow-md', 'shadow-slate-500', this._states.variant];
  }

  set states(value: ToastItemProps) {
    this._states = value;
    this._CDR.detectChanges();
  }

  @Input()
  set text(value: string) {
    this._applyUpdatesAndDetectChanges('text', () => value);
  }

  get text(): string {
    return this._states.text;
  }

  @Input()
  set variant(value: typeof this._states.variant) {
    this._applyUpdatesAndDetectChanges('variant', () => value);
  }

  get variant(): typeof this._states.variant {
    return this._states.variant;
  }

  @Input()
  set isAutoDismiss(value: boolean) {
    this._applyUpdatesAndDetectChanges('isAutoDismiss', () => value);
  }

  get isAutoDismiss(): boolean {
    return this._states.isAutoDismiss;
  }

  @Input()
  set action(value: IToastAction | undefined) {
    this._applyUpdatesAndDetectChanges('action', () => value);
  }

  get action(): IToastAction | undefined {
    return this._states.action;
  }

  get iconPath(): string {
    return this._iconPaths.get(this._states.variant, '');
  }

  @Output()
  ready: EventEmitter<ToastItemProps>;

  @Output()
  stateChanged: EventEmitter<ToastItemStateChanges>;

  @Output()
  close: EventEmitter<void>;

  constructor(
    private readonly _CDR: ChangeDetectorRef,
    private readonly _stateService: StateService,
    private readonly _el: ElementRef<Element>
  ) {
    this._isReady = false;
    this._iconPaths = this._getIconPaths();
    this._states = this._init();

    this.ready = new EventEmitter();
    this.close = new EventEmitter();
    this.stateChanged = new EventEmitter();
  }

  ngAfterViewInit(): void {
    this._isReady = true;
    this.ready.emit(this._states);
  }

  onActionClick(): void {
    if (!this.action) {
      return;
    }

    this.action.command();
    this.close.emit();
  }

  private _applyUpdatesAndDetectChanges(key: keyof IToastItemProps, updater: StateUpdateFn<IToastItemProps>): void {
    this._states = this._updateStateAndEmitChanges(this._states, key, updater);

    if (this._isReady) {
      this._CDR.detectChanges();
    }
  }

  private _updateStateAndEmitChanges(states: ToastItemProps, key: keyof IToastItemProps, updater: StateUpdateFn<IToastItemProps>): ToastItemProps {
    const [currentState] = this._stateService
      .updateState<IToastItemProps>(states, key, updater)
      .map(this._emitStateChanges.bind(this))
      .run();

    return currentState;
  }

  private _emitStateChanges([oldState, currentState]: ToastItemProps[]): ToastItemProps {
    if (this._isReady && oldState !== currentState) {
      this.stateChanged.emit(new ToastItemStateChanges({ oldState, currentState }));
    }

    return currentState;
  }

  private _getIconPaths(): Map<typeof this._states.variant, string> {
    return Map({
      neutral: 'M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z',
      warn: 'M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480H40c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24V296c0 13.3 10.7 24 24 24s24-10.7 24-24V184c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z',
      success: 'M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z',
      error: 'M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24V264c0 13.3-10.7 24-24 24s-24-10.7-24-24V152c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z',
    });
  }

  private _init(): ToastItemProps {
    return new ToastItemProps();
  }
}
