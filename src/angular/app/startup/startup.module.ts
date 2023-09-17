import { GitWorkspaceHistoryComponent } from './../../shared/components/organisms/git-workspace-history/git-workspace-history.component';
import { WorkspaceHistoryComponent } from '@components/organisms/workspace-history/workspace-history.component';
import { StartupRoutingModule } from './startup-routing.module';
import { NavVerticalComponent } from '@components/molecules/nav-vertical/nav-vertical.component';
import { StartupComponent } from './startup.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [StartupComponent],
  imports: [
    CommonModule,
    StartupRoutingModule,
    NavVerticalComponent,
    WorkspaceHistoryComponent,
    GitWorkspaceHistoryComponent,
  ],
})
export class StartupModule {}
