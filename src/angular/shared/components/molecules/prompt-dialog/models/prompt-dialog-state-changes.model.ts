import { IPromptDialogProps } from '../interfaces/prompt-dialog-props.interface';
import { IStateChanges } from '@services/state/interfaces/state-changes.interface';
import { Record } from 'immutable';

const defaultValue: IStateChanges<IPromptDialogProps> = {
  oldState: undefined,
  currentState: undefined,
};

export class PromptDialogStateChanges extends Record<IStateChanges<IPromptDialogProps>>(defaultValue) {}
