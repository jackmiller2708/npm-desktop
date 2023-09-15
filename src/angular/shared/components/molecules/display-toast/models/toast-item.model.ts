import { IToastItem } from '../interfaces/toast-item.interface';
import { Record } from 'immutable';

const defaultValues: IToastItem = {
  text: '',
  variant: 'neutral',
  isAutoDismiss: false,
  actionLabel: undefined,
};

export class ToastItem extends Record<IToastItem>(defaultValues) {}
