import { WorkspaceHistoryItemStateChanges } from '../../molecules/item-workspace-history/models/workspace-history-item.state-changes.model';
import { InterProcessCommunicator } from 'src/angular/shared/services/IPC/inter-process-communicator.service';
import { WorkspaceHistoryItem } from '../../molecules/item-workspace-history/models/workspace-history-item.model';
import { Injectable } from '@angular/core';
import { List } from 'immutable';

@Injectable()
export class WorkspaceHistoryService {
  constructor(private readonly _IPC: InterProcessCommunicator) {}

  getStateHandler(changes: WorkspaceHistoryItemStateChanges) {
    if (changes.currentState?.isEditing !== changes.oldState?.isEditing) {
      return this._validateItemEditState;
    }

    if (changes.currentState?.dataSource !== changes.oldState?.dataSource) {
      return this._validateItemDataSource;
    }

    return this._updateItemState;
  }

  registerItem(collection: List<WorkspaceHistoryItem>, item: WorkspaceHistoryItem): List<WorkspaceHistoryItem> {
    return collection.push(item);
  }

  private _validateItemEditState(collection: List<WorkspaceHistoryItem>, changes: WorkspaceHistoryItemStateChanges): List<WorkspaceHistoryItem> {
    return collection.map((state, i) =>
      collection.indexOf(changes.oldState!) === i
        ? changes.currentState!
        : state.set('isEditing', false)
    );
  }

  private _validateItemDataSource(collection: List<WorkspaceHistoryItem>, changes: WorkspaceHistoryItemStateChanges): List<WorkspaceHistoryItem> {
    this._IPC.send('update-workspace', JSON.stringify(changes.currentState?.dataSource));

    return this._updateItemState(collection, changes);
  }

  private _updateItemState(collection: List<WorkspaceHistoryItem>, changes: WorkspaceHistoryItemStateChanges): List<WorkspaceHistoryItem> {
    const { oldState, currentState } = changes;
    const index = collection.indexOf(oldState!);

    return collection.set(index, currentState!);
  }
}
