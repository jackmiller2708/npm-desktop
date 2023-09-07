import { WorkspaceHistoryComponent } from 'src/angular/shared/components/organisms/workspace-history/workspace-history.component';
import { RouterModule, Routes } from '@angular/router';
import { StartupComponent } from './startup.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: '',
    component: StartupComponent,
    children: [
      { path: 'workspaces', component: WorkspaceHistoryComponent },
      { path: '**', redirectTo: 'workspaces' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StartupRoutingModule {}
