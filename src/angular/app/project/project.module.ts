import { ContainerResizableComponent } from '@shared/components/atoms/container-resizable/container-resizable.component';
import { DisplayPackageComponent } from '@shared/components/molecules/display-package/display-package.component';
import { DetailsPackageComponent } from '@shared/components/molecules/details-package/details-package.component';
import { OverlayscrollbarsModule } from 'overlayscrollbars-ngx';
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
    DetailsPackageComponent,
    ContainerResizableComponent,
  ],
})
export class ProjectModule {}
