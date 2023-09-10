import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, Subscription, map, takeUntil } from 'rxjs';
import { InterProcessCommunicator } from 'src/angular/shared/services/IPC/inter-process-communicator.service';
import { IWorkspaceHistoryDTO } from 'src/angular/shared/interfaces/workspace-history-dto.interface';
import { WorkspaceHistory } from 'src/angular/shared/models/workspace-history.model';
import { ButtonComponent } from '../../atoms/button/button.component';
import { TextComponent } from '../../atoms/text/text.component';
import { CommonModule } from '@angular/common';
import { Workspace } from 'src/angular/shared/models/workspace.model';
import { List } from 'immutable';

@Component({
  selector: 'app-workspace-history',
  standalone: true,
  imports: [CommonModule, TextComponent, ButtonComponent],
  templateUrl: './workspace-history.component.html',
  styleUrls: ['./workspace-history.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkspaceHistoryComponent implements OnInit, OnDestroy {
  private readonly _ngDestroy$: Subject<void>;
  private _workspaces: List<Workspace>;

  get workspaces(): List<Workspace> {
    return this._workspaces;
  }

  constructor(
    private readonly _IPC: InterProcessCommunicator,
    private readonly _CDR: ChangeDetectorRef
  ) {
    this._ngDestroy$ = new Subject();
    this._workspaces = List();
  }

  ngOnInit(): void {
    this._initStores();
    this._IPC.send('load-workspace-history');
  }

  ngOnDestroy(): void {
    this._ngDestroy$.next();
  }

  onOpenWorkspaceBtnClick(): void {
    this._IPC.send('open-workspace');
  }

  private _processDataSource(data: WorkspaceHistory): void {
    // if (data.lastOpened) {
    //   return;
    // }

    this._workspaces = data.workspaces;
    this._CDR.detectChanges();
  }

  private _dtoToDataMapper(data: IWorkspaceHistoryDTO): WorkspaceHistory {
    const { workspaces, lastOpened } = data;

    const workspaceList = List(workspaces.map((workspace) => new Workspace(workspace)));
    const lastOpenedRec = lastOpened ? new Workspace(lastOpened) : lastOpened;

    return new WorkspaceHistory({
      workspaces: workspaceList,
      lastOpened: lastOpenedRec,
    });
  }

  private _initStores(): void {
    const workspaceHistory$ = this._IPC.on<IWorkspaceHistoryDTO>('workspace-history-loaded').pipe(map(this._dtoToDataMapper));

    this._register(workspaceHistory$, this._processDataSource);
  }

  private _register<T>(store$: Observable<T>, processor: (data: T) => void): Subscription {
    return store$
      .pipe(takeUntil(this._ngDestroy$))
      .subscribe(processor.bind(this));
  }
}
