import { IToastItemProps } from '../interfaces/toast-item-props.interface';
import { Record } from 'immutable';

const defaultValues: IToastItemProps = {
  text: '',
  isAutoDismiss: false,
  variant: 'neutral',
  action: undefined,
};

export class ToastItemProps extends Record<IToastItemProps>(defaultValues) {}
