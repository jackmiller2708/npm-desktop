import { ConnectedPosition } from '@angular/cdk/overlay';

export interface IPopupProps {
  target: Element | undefined;
  isShown: boolean;
  positions: ConnectedPosition[];
}
