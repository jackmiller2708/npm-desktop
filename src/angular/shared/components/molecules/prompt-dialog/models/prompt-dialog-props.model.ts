import { IPromptDialogProps } from '../interfaces/prompt-dialog-props.interface';
import { Record } from 'immutable';

const defaultValues: IPromptDialogProps = {
  isShown: false,
  showHeader: true,
  headerClass: undefined,
  headerContent: undefined,
  headerIconPath: undefined,
};

export class PromptDialogProps extends Record<IPromptDialogProps>(defaultValues) {}
