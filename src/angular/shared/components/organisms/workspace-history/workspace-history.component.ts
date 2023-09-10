import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, Subscription, map, takeUntil } from 'rxjs';
import { ItemWorkspaceHistoryComponent } from '../../molecules/item-workspace-history/item-workspace-history.component';
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
  imports: [CommonModule, TextComponent, ButtonComponent, ItemWorkspaceHistoryComponent],
  templateUrl: './workspace-history.component.html',
  styleUrls: ['./workspace-history.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkspaceHistoryComponent implements OnInit, OnDestroy {
  private readonly _ngDestroy$: Subject<void>;
  private _workspaces: List<Workspace>;
  private _isReady: boolean;

  @HostBinding('class')
  private get _classes(): string[] {
    return ['flex', 'flex-col', 'gap-4']
  }

  get workspaces(): List<Workspace> {
    return this._workspaces;
  }

  get isNoPreviouslyOpenedWorkspace(): boolean {
    return this._workspaces.size === 0;
  }

  get isReady(): boolean {
    return this._isReady;
  }

  constructor(
    private readonly _IPC: InterProcessCommunicator,
    private readonly _CDR: ChangeDetectorRef
  ) {
    this._ngDestroy$ = new Subject();
    this._workspaces = List();
    this._isReady = false;
  }

  ngOnInit(): void {
    this._initStores();
    this._IPC.send('load-workspace-history');
  }

  ngOnDestroy(): void {
    this._ngDestroy$.next();
  }

  onWorkspaceSelected(workspace: Workspace): void {
    this._IPC.send('open-workspace', JSON.stringify(workspace));
  }

  onOpenWorkspaceBtnClick(): void {
    this._IPC.send('open-workspace');
  }

  private _processDataSource(data: WorkspaceHistory): void {
    // if (data.lastOpened) {
    //   return;
    // }

    this._workspaces = data.workspaces;
    this._isReady = true;
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
