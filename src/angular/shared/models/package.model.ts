import { IPackage } from '../interfaces/package.interface';
import { Record } from 'immutable';

const defaultValues: IPackage = {
  name: '',
  path: '',
  version: '',
};

export class Package extends Record<IPackage>(defaultValues) {}
