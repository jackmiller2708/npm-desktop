import { IPopupMenuProps } from '../interfaces/popup-menu-props.interface';
import { IStateChanges } from '@services/state/interfaces/state-changes.interface';
import { Record } from 'immutable';

const defaultValues: IStateChanges<IPopupMenuProps> = {
  oldState: undefined,
  currentState: undefined,
};

export class PopupMenuStateChanges extends Record<IStateChanges<IPopupMenuProps>>(defaultValues) {}
