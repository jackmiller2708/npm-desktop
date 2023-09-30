import { Component, OnDestroy, OnInit, ChangeDetectorRef, HostBinding } from '@angular/core';
import { WorkspaceEvent, WorkspaceEventMessages } from '@shared/models/event.model';
import { InterProcessCommunicator } from '@services/IPC/inter-process-communicator.service';
import { Subject, firstValueFrom, tap } from 'rxjs';
import { ActivatedRoute, Params } from '@angular/router';
import { NavigatorService } from '@shared/services/navigator/navigator.service';
import { EventBusService } from '@shared/services/event-bus/event-bus.service';
import { LoaderService } from '@services/loader/loader.service';
import { ToastService } from '@shared/services/toast/toast.service';
import { TitleService } from '@shared/services/title/title.service';
import { MonadService } from '@services/monad/monad.service';
import { IToastItem } from '@shared/components/molecules/display-toast/interfaces/toast-item.interface';
import { Workspace } from '@models/workspace.model';
import { List, Map } from 'immutable';
import { IAppEvent } from '@shared/interfaces/event.interface';
import { Package } from '@models/package.model';
import { Either } from '@services/monad/models/either.monad';
import { Helper } from '@shared/helper.class';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
})
export class ProjectComponent implements OnInit, OnDestroy {
  private readonly _ngDestroy: Subject<void>;
  private _workspace: Workspace | undefined;
  private _selectedPackage: Package | undefined;
  private _highlightedDeps: List<Package>;
  private _appDeps: Map<string, Package>;
  private _devDeps: Map<string, Package>;
  private _version: string | undefined;

  @HostBinding('class')
  private get _classes(): string[] {
    return ['h-full', 'w-full', 'flex', 'flex-col'];
  }

  get name(): string {
    return this._workspace?.name ?? "";
  }

  get version(): string | undefined {
    return this._version;
  }

  get appDeps(): Map<string, Package> {
    return this._appDeps;
  }

  get devDeps(): Map<string, Package> {
    return this._devDeps;
  }

  get highlightedDeps(): List<Package> {
    return this._highlightedDeps;
  }

  set selectedPackage(value: Package) {
    this._selectedPackage = value;
    this._CDR.detectChanges();
  }

  get selectedPackage(): Package | undefined {
    return this._selectedPackage;
  }

  constructor(
    private readonly _eventBusService: EventBusService,
    private readonly _monadService: MonadService,
    private readonly _loaderService: LoaderService,
    private readonly _toastService: ToastService,
    private readonly _navigator: NavigatorService,
    private readonly _titleService: TitleService,
    private readonly _route: ActivatedRoute,
    private readonly _IPC: InterProcessCommunicator,
    private readonly _CDR: ChangeDetectorRef,
  ) {
    this._highlightedDeps = List();
    this._appDeps = this._devDeps = Map();
    this._ngDestroy = new Subject();
  }

  ngOnInit(): void {
    this._loaderService.setLoading(true);
    this._initStores();
  }

  ngOnDestroy(): void {
    this._IPC.send('close-workspace');
    this._titleService.removeTitle();
    this._titleService.resetWindowTitle();
    this._toastService.clearMessages();
    this._ngDestroy.next();
  }

  onSelectedPackageChange(pkg: Package): void {
    const packageIndex = this._highlightedDeps.indexOf(pkg);

    if(packageIndex === -1) {
      return;
    }

    this._highlightedDeps = this._highlightedDeps.remove(packageIndex);
    this._CDR.detectChanges();
  }

  private _onWorkspaceLoaded(data: string): void {
    const { dependencies, devDependencies, version } = JSON.parse(data);
    const depsEntries = Object.entries<Record<string, any>>(dependencies);

    let appDeps: Map<string, Package>;
    let devDeps: Map<string, Package>;
    let missingPackageList = List<Package>();

    appDeps = devDeps = Map();

    for (const [key, obj] of depsEntries) {
      const pkg = new Package({ name: key, version: this._extractPackageVersion(obj, key), ...obj });

      if (obj['missing']) {
        missingPackageList = missingPackageList.push(pkg);
      }

      if (key in devDependencies) {
        devDeps = devDeps.set(key, pkg);
        continue;
      }

      appDeps = appDeps.set(key, pkg);
    }

    this._version = version;
    this._appDeps = appDeps.sortBy(pkg => pkg.name);
    this._devDeps = devDeps.sortBy(pkg => pkg.name);

    this._eventBusService.emit(
      new WorkspaceEvent({
        message: WorkspaceEventMessages.OPEN,
        data: appDeps.concat(devDeps),
      })
    );
    
    this._titleService.setTitle(`${this._workspace!.name} - ${version}`);
    this._loaderService.setLoading(false);
    
    if (missingPackageList.size > 0) {
      firstValueFrom(this._loaderService.loadAnimationFinish$).then((): void =>
        this._toastService.addMessage(this._makeMissingPackageToast(missingPackageList))
      );
    }
    
    this._CDR.detectChanges();
  }

  private _makeHighlightPackageToastCommand(missingPackageList: List<Package>): () => void {
    return () => {
      this._highlightedDeps = missingPackageList.filter(
        (pkg: Package): boolean => pkg !== this._selectedPackage
      );
      this._CDR.detectChanges();
    };
  }

  private _makeMissingPackageToast(missingPackageList: List<Package>): IToastItem {
    return {
      text: `There are ${missingPackageList.size} missing required package(s)`,
      variant: 'warn',
      duration: 5000,
      isAutoDismissible: true,
      action: {
        label: 'Highlight!',
        command: this._makeHighlightPackageToastCommand(missingPackageList),
      },
    } as IToastItem;
  }

  private _extractPackageVersion(pkg: Record<string, any>, name: string): string {
    if (pkg['missing'] && pkg['required']) {
      return pkg['required'];
    }

    // Accommodates cases when the package is missing from workspace
    // but the required version is not provided.
    if (pkg['missing'] && !pkg['required']) {
      const [message] = pkg['problems'];
      const [, secondHalf] = message.split(name);

      return secondHalf.slice(1, secondHalf.indexOf(','));
    }

    return pkg['version'];
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
        this._titleService.setWindowTitle(`${workspace.name} - NPM Desktop`);
        this._IPC.send('load-workspace', JSON.stringify(workspace));
      }
    );
  }

  private _onAppEvents(event: IAppEvent): void {
    if (event instanceof WorkspaceEvent && event.message === WorkspaceEventMessages.CLOSE) {
      this._navigator.navigate(['/', 'startup']);
    }
  }

  private _initStores(): void {
    const _register = Helper.makeObservableRegistrar.call(this, this._ngDestroy);
    const _workspaceLoaded$ = this._IPC.on<string>('workspace-loaded');
    const _params$ = this._route.queryParams;

    _register(_workspaceLoaded$, this._onWorkspaceLoaded);
    _register(_params$, this._onParamsLoaded);
    _register(this._eventBusService.appEvents$, this._onAppEvents);
  }
}
