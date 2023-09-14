import { IPopupProps } from '../interfaces/popup-props.interface';
import { Record } from 'immutable';

const defaultValues: IPopupProps = {
  isShown: false,
  target: undefined,
  dropdownPositions: [],
};

export class PopupProps extends Record<IPopupProps>(defaultValues) {}
