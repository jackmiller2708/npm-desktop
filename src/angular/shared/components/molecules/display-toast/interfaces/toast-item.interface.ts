export interface IToastItem {
  text: string;
  variant: 'warn' | 'error' | 'success' | 'neutral';
  duration: number;
  actionLabel: IToastAction | undefined;
}

export interface IToastAction {
  label: string;
  command: () => void;
}
