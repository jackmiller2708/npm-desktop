import { WorkspaceHistoryComponent } from 'src/angular/shared/components/organisms/workspace-history/workspace-history.component';
import { VerticalNavComponent } from 'src/angular/shared/components/molecules/vertical-nav/vertical-nav.component';
import { StartupRoutingModule } from './startup-routing.module';
import { StartupComponent } from './startup.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [StartupComponent],
  imports: [
    CommonModule,
    StartupRoutingModule,
    VerticalNavComponent,
    WorkspaceHistoryComponent,
  ],
})
export class StartupModule {}
