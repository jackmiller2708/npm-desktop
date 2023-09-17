import { Component, NgZone, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { InterProcessCommunicator } from '@services/IPC/inter-process-communicator.service';
import { ActivatedRoute, Params } from '@angular/router';
import { LoaderService } from '@services/loader/loader.service';
import { MonadService } from '@services/monad/monad.service';
import { Workspace } from '@models/workspace.model';
import { Package } from '@models/package.model';
import { Subject } from 'rxjs';
import { Either } from '@services/monad/models/either.monad';
import { Router } from '@angular/router';
import { Helper } from '@shared/helper.class';
import { Map } from 'immutable';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
})
export class ProjectComponent implements OnInit, OnDestroy {
  private readonly _ngDestroy$: Subject<void>;
  private _workspace: Workspace | undefined;
  private _appDeps: Map<string, Package>;
  private _devDeps: Map<string, Package>;

  get name(): string {
    return this._workspace?.name ?? "";
  }

  get appDeps(): Map<string, Package> {
    return this._appDeps;
  }

  get devDeps(): Map<string, Package> {
    return this._devDeps;
  }

  constructor(
    private readonly _monadService: MonadService,
    private readonly _loaderService: LoaderService,
    private readonly _router: Router,
    private readonly _route: ActivatedRoute,
    // used with `_router.navigate` to mitigate the warning: "Navigation triggered outside Angular zone, did you forget to call 'ngZone.run()'?"
    private readonly _ngZone: NgZone,
    private readonly _IPC: InterProcessCommunicator,
    private readonly _CDR: ChangeDetectorRef
  ) {
    this._appDeps = this._devDeps = Map();
    this._ngDestroy$ = new Subject();
  }

  ngOnInit(): void {
    this._loaderService.setLoading(true);
    this._initStores();
  }

  ngOnDestroy(): void {
    this._IPC.send('close-workspace');
    this._ngDestroy$.next();
  }

  onClosePrjBtnClick() {
    this._ngZone.run(() => this._router.navigate(['/', 'startup']));
  }


  private _onWorkspaceLoaded(data: string): void {
    const { dependencies, devDependencies } = JSON.parse(data);
    const depsEntries = Object.entries<Record<string, any>>(dependencies);

    let appDeps: Map<string, Package>;
    let devDeps: Map<string, Package>;

    appDeps = devDeps = Map();

    for (const [key, obj] of depsEntries) {
      const pkg = new Package({ name: key, ...obj });

      if (key in devDependencies) {
        devDeps = devDeps.set(key, pkg);
        continue;
      }

      appDeps = appDeps.set(key, pkg);
    }

    this._appDeps = appDeps;
    this._devDeps = devDeps;
    this._loaderService.setLoading(false);
    this._CDR.detectChanges();
  }

  private _extractWorkspaceFromParams(params: Params): Either<Error, Workspace> {
    try {
      return this._monadService.either().right(new Workspace(JSON.parse(params['workspace'])));
    } catch (err) {
      return this._monadService.either().left(err as Error);
    }
  }

  private _onParamsLoaded(params: Params): void {
    this._extractWorkspaceFromParams(params).fold<void>(
      (error: Error): void => void error,
      (workspace: Workspace): void => {
        this._workspace = workspace;
        this._IPC.send('load-workspace', JSON.stringify(workspace));
      }
    );
  }

  private _initStores(): void {
    const _register = Helper.makeObservableRegistrar.call(this, this._ngDestroy$);
    const _workspaceLoaded$ = this._IPC.on<string>('workspace-loaded');
    const _params$ = this._route.queryParams;

    _register(_workspaceLoaded$, this._onWorkspaceLoaded);
    _register(_params$, this._onParamsLoaded);
  }
}
