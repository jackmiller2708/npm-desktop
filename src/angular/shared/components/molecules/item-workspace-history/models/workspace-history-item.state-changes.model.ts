import { IWorkspaceHistoryItem } from "../interfaces/workspace-history-item.interface";
import { IStateChanges } from "src/angular/shared/services/state/interfaces/state-changes.interface";
import { Record } from "immutable";

const defaultValues: IStateChanges<IWorkspaceHistoryItem> = {
  oldState: undefined,
  currentState: undefined
}

export class WorkspaceHistoryItemStateChanges extends Record<IStateChanges<IWorkspaceHistoryItem>>(defaultValues) {}