import { IStateChanges } from '@services/state/interfaces/state-changes.interface';
import { IPopupProps } from '../interfaces/popup-props.interface';
import { Record } from 'immutable';

const defaultValues: IStateChanges<IPopupProps> = {
  oldState: undefined,
  currentState: undefined,
};

export class PopupStateChanges extends Record<IStateChanges<IPopupProps>>(defaultValues) {}
