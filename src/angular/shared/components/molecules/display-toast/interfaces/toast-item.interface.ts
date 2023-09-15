export interface IToastItem {
  text: string;
  variant: 'warn' | 'error' | 'success' | 'neutral';
  isAutoDismiss: boolean;
  actionLabel: IToastAction | undefined;
}

export interface IToastAction {
  label: string;
  command: () => void;
}
