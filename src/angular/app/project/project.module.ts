import { ContainerResizableComponent } from '@shared/components/atoms/container-resizable/container-resizable.component';
import { DisplayPackageComponent } from '@shared/components/molecules/display-package/display-package.component';
import { OverlayscrollbarsModule } from 'overlayscrollbars-ngx';
import { PackageViewerComponent } from '@shared/components/organisms/package-viewer/package-viewer.component';
import { ProjectRoutingModule } from './project-routing.module';
import { ButtonComponent } from '@components/atoms/button/button.component';
import { ProjectComponent } from './project.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [ProjectComponent],
  imports: [
    CommonModule,
    ProjectRoutingModule,
    OverlayscrollbarsModule,
    ButtonComponent,
    DisplayPackageComponent,
    PackageViewerComponent,
    ContainerResizableComponent,
  ],
})
export class ProjectModule {}
