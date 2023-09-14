import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { PromptDialogStateChanges } from './models/prompt-dialog-state-changes.model';
import { IPromptDialogProps } from './interfaces/prompt-dialog-props.interface';
import { PromptDialogProps } from './models/prompt-dialog-props.model';
import { DialogComponent } from '../../atoms/dialog/dialog.component';
import { StateUpdateFn } from 'src/angular/shared/services/state/interfaces/state-changes.interface';
import { IconComponent } from '../../atoms/icon/icon.component';
import { TextComponent } from '../../atoms/text/text.component';
import { CommonModule } from '@angular/common';
import { StateService } from 'src/angular/shared/services/state/state.service';

@Component({
  selector: 'app-prompt-dialog',
  templateUrl: './prompt-dialog.component.html',
  styleUrls: ['./prompt-dialog.component.scss'],
  standalone: true,
  imports: [CommonModule, DialogComponent, IconComponent, TextComponent],
})
export class PromptDialogComponent implements AfterViewInit {
  private _states: PromptDialogProps;
  private _isReady: boolean;

  @HostBinding('class')
  private get _classes(): string[] {
    return ['hidden'];
  }

  @Input()
  set isShown(value: boolean) {
    this._applyUpdatesAndDetectChanges('isShown', () => value);
  }

  get isShown(): boolean {
    return this._states.isShown;
  }

  @Input()
  set headerContent(value: string | undefined) {
    this._applyUpdatesAndDetectChanges('headerContent', () => value);
  }

  get headerContent(): string | undefined {
    return this._states.headerContent;
  }

  @Input()
  set headerIconPath(value: string | undefined) {
    this._applyUpdatesAndDetectChanges('headerIconPath', () => value);
  }

  get headerIconPath(): string | undefined {
    return this._states.headerIconPath;
  }

  @Input()
  set showHeader(value: boolean) {
    this._applyUpdatesAndDetectChanges('showHeader', () => value);
  }

  get showHeader(): boolean {
    return this._states.showHeader;
  }

  @Input()
  set headerClass(value: string) {
    this._applyUpdatesAndDetectChanges('headerClass', () => value);
  }

  get headerClass(): string[] {
    return this._states.headerClass?.split(' ') ?? [];
  }

  @Output()
  ready: EventEmitter<PromptDialogProps>;

  @Output()
  stateChanged: EventEmitter<PromptDialogStateChanges>;

  @Output()
  close: EventEmitter<void>;

  @Output()
  isShownChange: EventEmitter<boolean>;

  constructor(
    private readonly _stateService: StateService,
    private readonly _CDR: ChangeDetectorRef
  ) {
    this._states = this._init();
    this._isReady = false;

    this.close = new EventEmitter();
    this.isShownChange = new EventEmitter();
    this.stateChanged = new EventEmitter();
    this.ready = new EventEmitter();
  }

  ngAfterViewInit(): void {
    this._isReady = true;
    this.ready.emit(this._states);
  }

  onCloseBtnClick(): void {
    this.isShown = false;
    this.isShownChange.emit(false);
    this.close.emit();
  }

  private _applyUpdatesAndDetectChanges(key: keyof IPromptDialogProps, updater: StateUpdateFn<IPromptDialogProps>): void {
    this._states = this._updateStateAndEmitChanges(this._states, key, updater);
    
    if (this._isReady) {
      this._CDR.detectChanges();
    }
  }

  private _updateStateAndEmitChanges(states: PromptDialogProps, key: keyof IPromptDialogProps, updater: StateUpdateFn<IPromptDialogProps>): PromptDialogProps {
    const [currentState] = this._stateService
      .updateState<IPromptDialogProps>(states, key, updater)
      .map(this._emitStateChanges.bind(this))
      .run();

    return currentState;
  }

  private _emitStateChanges([oldState, currentState]: PromptDialogProps[]): PromptDialogProps {
    if (this._isReady && oldState !== currentState) {
      this.stateChanged.emit(new PromptDialogStateChanges({ oldState, currentState }));
    }

    return currentState;
  }

  private _init() {
    return new PromptDialogProps();
  }
}
