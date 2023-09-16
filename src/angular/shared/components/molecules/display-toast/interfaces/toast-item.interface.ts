export interface IToastItem {
  text: string;
  variant: 'warn' | 'error' | 'success' | 'neutral';
  duration: number;
  action: IToastAction | undefined;
  isAutoDismissible: boolean;
}

export interface IToastAction {
  label: string;
  command: () => void;
}
