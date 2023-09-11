import { INavItem } from '../interfaces/nav-item.interface';
import { Record } from 'immutable';

const defaultValues: INavItem = {
  content: '',
  disabled: false,
  routerLink: undefined,
  iconPath: undefined,
};

export class NavItem extends Record<INavItem>(defaultValues) {}
