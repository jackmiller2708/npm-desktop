import { IToastItem } from '../interfaces/toast-item.interface';
import { Record } from 'immutable';

const defaultValues: IToastItem = {
  text: '',
  variant: 'neutral',
  duration: 2000,
  action: undefined,
  isAutoDismissible: false
};

export class ToastItem extends Record<IToastItem>(defaultValues) {}
