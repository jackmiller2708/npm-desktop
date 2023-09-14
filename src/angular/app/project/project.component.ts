import { Component, NgZone, OnDestroy } from '@angular/core';
import { InterProcessCommunicator } from 'src/angular/shared/services/IPC/inter-process-communicator.service';
import { MonadService } from 'src/angular/shared/services/monad/monad.service';
import { Workspace } from 'src/angular/shared/models/workspace.model';
import { Either } from 'src/angular/shared/services/monad/models/either.monad';
import { Router } from '@angular/router';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
})
export class ProjectComponent implements OnDestroy {
  private _workspace: Workspace;

  constructor(
    private readonly _monadService: MonadService,
    private readonly _router: Router,
    // used with `_router.navigate` to mitigate the warning: "Navigation triggered outside Angular zone, did you forget to call 'ngZone.run()'?"
    private readonly _ngZone: NgZone,
    private readonly _IPC: InterProcessCommunicator
  ) {
    this._workspace = this._init();
  }

  ngOnDestroy(): void {
    this._IPC.send('close-workspace');
  }

  onClosePrjBtnClick() {
    this._ngZone.run(() => this._router.navigate(['/', 'startup']));
  }

  private _extractWorkspace(state: Record<string, any>): Either<Error, Workspace> {
    try {
      const { workspace } = state;

      return this._monadService.either().right(new Workspace(JSON.parse(workspace)));
    } catch (err) {
      return this._monadService.either().left(err as Error);
    }
  }

  private _init() {
    return this._extractWorkspace(this._router.lastSuccessfulNavigation?.extras.state!)
      .fold<Workspace>(() => new Workspace(), (workspace) => workspace);
  }
}
