import { List, Record } from "immutable";
import { IWorkspaceHistory } from "../interfaces/workspace-history.interface";

export class WorkspaceHistory extends Record<IWorkspaceHistory>({
  workspaces: List(),
  lastOpened: undefined
}) {}