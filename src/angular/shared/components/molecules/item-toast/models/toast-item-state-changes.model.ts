import { IToastItemProps } from '../interfaces/toast-item-props.interface';
import { IStateChanges } from 'src/angular/shared/services/state/interfaces/state-changes.interface';
import { Record } from 'immutable';

const defaultValues: IStateChanges<IToastItemProps> = {
  oldState: undefined,
  currentState: undefined,
};

export class ToastItemStateChanges extends Record<IStateChanges<IToastItemProps>>(defaultValues) {}
