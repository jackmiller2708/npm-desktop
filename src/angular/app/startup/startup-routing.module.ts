import { GitWorkspaceHistoryComponent } from '@components/organisms/git-workspace-history/git-workspace-history.component';
import { WorkspaceHistoryComponent } from '@components/organisms/workspace-history/workspace-history.component';
import { RouterModule, Routes } from '@angular/router';
import { StartupComponent } from './startup.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: '',
    component: StartupComponent,
    children: [
      { path: 'workspaces', component: WorkspaceHistoryComponent },
      { path: 'from-git', component: GitWorkspaceHistoryComponent },
      { path: '**', redirectTo: 'workspaces' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StartupRoutingModule {}
