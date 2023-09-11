import { WorkspaceHistoryItem } from '../../molecules/item-workspace-history/models/workspace-history-item.model';
import { Injectable } from '@angular/core';
import { List } from 'immutable';

@Injectable()
export class WorkspaceHistoryService {
  registerItem(collection: List<WorkspaceHistoryItem>, item: WorkspaceHistoryItem): List<WorkspaceHistoryItem> {
    return collection.push(item);
  }

  validateItemEditState(collection: List<WorkspaceHistoryItem>, changes: { oldState: WorkspaceHistoryItem; currentState: WorkspaceHistoryItem; }): List<WorkspaceHistoryItem> {
    return collection.map((state, i) =>
      collection.indexOf(changes.oldState) === i
        ? changes.currentState
        : state.set('isEditing', false)
    );
  }

  updateItemState(collection: List<WorkspaceHistoryItem>, changes: { oldState: WorkspaceHistoryItem; currentState: WorkspaceHistoryItem; }): List<WorkspaceHistoryItem> {
    const { oldState, currentState } = changes;
    const index = collection.indexOf(oldState);

    return collection.set(index, currentState);
  }
}
