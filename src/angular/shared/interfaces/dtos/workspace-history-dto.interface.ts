import { IWorkspaceDTO } from './workspace-dto.interface';

export interface IWorkspaceHistoryDTO {
  workspaces: IWorkspaceDTO[];
  lastOpened?: IWorkspaceDTO;
}
