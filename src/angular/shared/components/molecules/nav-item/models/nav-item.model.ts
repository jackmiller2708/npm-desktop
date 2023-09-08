import { INavItem } from '../interfaces/nav-item.interface';
import { Record } from 'immutable';

export class NavItem extends Record<INavItem>({
  content: '',
  disabled: false,
  routerLink: undefined,
  iconPath: undefined,
}) {}
