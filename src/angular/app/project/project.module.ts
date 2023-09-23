import { DisplayPackageComponent } from '@shared/components/molecules/display-package/display-package.component';
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
    ButtonComponent,
    DisplayPackageComponent,
  ],
})
export class ProjectModule {}
