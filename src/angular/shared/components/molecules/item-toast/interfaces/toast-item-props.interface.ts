export interface IToastItemProps {
  text: string;
  variant: 'warn' | 'error' | 'success' | 'neutral';
  isAutoDismiss: boolean;
  action: IToastAction | undefined;
}

export interface IToastAction {
  label: string;
  command: () => void;
}
