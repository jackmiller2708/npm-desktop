import { ProjectRoutingModule } from './project-routing.module';
import { ButtonComponent } from 'src/angular/shared/components/atoms/button/button.component';
import { ProjectComponent } from './project.component';
import { NgOptimizedImage } from '@angular/common';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';


@NgModule({
  declarations: [ProjectComponent],
  imports: [
    CommonModule,
    ProjectRoutingModule,
    ButtonComponent,
    NgOptimizedImage,
  ],
})
export class ProjectModule {}
