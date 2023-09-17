import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, NgZone, OnDestroy, OnInit, HostListener } from '@angular/core';
import { Observable, Subject, Subscription, filter, firstValueFrom, map, switchMap, takeUntil } from 'rxjs';
import { WorkspaceHistoryItemStateChanges } from './../../molecules/item-workspace-history/models/workspace-history-item.state-changes.model';
import { ItemWorkspaceHistoryComponent } from '../../molecules/item-workspace-history/item-workspace-history.component';
import { InterProcessCommunicator } from '@services/IPC/inter-process-communicator.service';
import { WorkspaceHistoryService } from './workspace-history.service';
import { WorkspaceHistoryItem } from '../../molecules/item-workspace-history/models/workspace-history-item.model';
import { IWorkspaceHistoryDTO } from '@interfaces/dtos/workspace-history-dto.interface';
import { WorkspaceHistory } from '@models/workspace-history.model';
import { ButtonComponent } from '../../atoms/button/button.component';
import { TextComponent } from '../../atoms/text/text.component';
import { LoaderService } from '@services/loader/loader.service';
import { CommonModule } from '@angular/common';
import { Workspace } from '@models/workspace.model';
import { List } from 'immutable';
import { Router } from '@angular/router';

@Component({
  selector: 'app-workspace-history',
  standalone: true,
  imports: [CommonModule, TextComponent, ButtonComponent, ItemWorkspaceHistoryComponent],
  providers: [WorkspaceHistoryService],
  templateUrl: './workspace-history.component.html',
  styleUrls: ['./workspace-history.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkspaceHistoryComponent implements OnInit, OnDestroy {
  private readonly _ngDestroy$: Subject<void>;
  private _workspaceItems: List<WorkspaceHistoryItem>;
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
    private readonly _workspaceHistoryService: WorkspaceHistoryService,
    private readonly _loaderService: LoaderService,
    private readonly _router: Router,
    // used with `_router.navigate` to mitigate the warning: "Navigation triggered outside Angular zone, did you forget to call 'ngZone.run()'?"
    private readonly _ngZone: NgZone,
    private readonly _IPC: InterProcessCommunicator,
    private readonly _CDR: ChangeDetectorRef,
  ) {
    this._workspaces = this._workspaceItems = List<any>();
    this._ngDestroy$ = new Subject();
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

  onWorkspaceItemReady(item: WorkspaceHistoryItem): void {
    this._workspaceItems = this._workspaceHistoryService.registerItem(this._workspaceItems, item);
  }

  onWorkspaceItemChanged(changes: WorkspaceHistoryItemStateChanges): void {
    const handler = this._workspaceHistoryService
      .getStateHandler(changes)
      .bind(this._workspaceHistoryService);

    this._workspaceItems = handler(this._workspaceItems, changes);
    this._CDR.detectChanges();
  }

  onWorkspaceItemRemove(workspace: Workspace): void {
    this._IPC.send('remove-workspace', JSON.stringify(workspace));
  }

  @HostListener('document:keydown', ['$event'])
  onOpenWorkspaceBtnClick(event?: KeyboardEvent): void {
    if (!event || (event && event.key === 'n' && event.ctrlKey)) {
      this._IPC.send('open-workspace');
    } 
  }

  getItemStateAt(index: number) {
    return this._workspaceItems.get(index);
  }

  private async _processDataSource(data: WorkspaceHistory): Promise<void> {
    if (data.lastOpened) {
      const loaderAnimationFinished = firstValueFrom(
        this._loaderService.isLoading$.pipe(
          filter((value: boolean): boolean => value),
          switchMap(() => this._loaderService.loadAnimationFinish$)
        )
      );

      this._loaderService.setLoading(true);

      await loaderAnimationFinished;

      return void this._ngZone.run(() =>
        this._router.navigate(['/', 'project'], {
          queryParams: { workspace: JSON.stringify(data.lastOpened) },
        })
      );
    }

    this._workspaceItems = List();
    this._workspaces = data.workspaces;
    this._isReady = true;
    this._CDR.detectChanges();
  }

  private _dtoToDataMapper(data: IWorkspaceHistoryDTO): WorkspaceHistory {
    const { workspaces, lastOpened } = data;

    const workspaceList = List(workspaces.map((workspace) => new Workspace(workspace)));
    const lastOpenedRec = lastOpened ? new Workspace(lastOpened) : lastOpened;

    return new WorkspaceHistory({ workspaces: workspaceList, lastOpened: lastOpenedRec });
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
