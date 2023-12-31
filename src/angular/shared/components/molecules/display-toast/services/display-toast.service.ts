import { Injectable } from '@angular/core';
import { ToastItem } from '../models/toast-item.model';
import { Helper } from '@shared/helper.class';

@Injectable()
export class DisplayToastService {
  get sortFn() {
    return {
      byPriority: this._priorityComparator.bind(this),
    };
  }

  constructor() {}

  private _variantPriorityComparator(variantA: 'error' | 'success' | 'warn' | 'neutral', variantB: 'error' | 'success' | 'warn' | 'neutral'): number {
    const variantOrder: (typeof variantA)[] = ['error', 'success', 'warn', 'neutral'];

    return Helper.clamp(variantOrder.indexOf(variantA) - variantOrder.indexOf(variantB), -1,1);
  }

  private _priorityComparator(messageA: ToastItem, messageB: ToastItem) {
    if (messageA.variant === 'error' && messageB.variant === 'error') {
      return messageA.action ? (messageB.action ? 0 : -1) :( messageB.action ? 1 : 0);
    }

    if (messageA.variant === 'error') {
      return -1;
    }

    if (messageB.variant === 'error') {
      return 1;
    }

    if (messageA.action && messageB.action) {
      return this._variantPriorityComparator(messageA.variant, messageB.variant);
    }

    if (messageA.action) {
      return -1;
    }

    if (messageB.action) {
      return 1;
    }
    
    return this._variantPriorityComparator(messageA.variant, messageB.variant);
  }
}
