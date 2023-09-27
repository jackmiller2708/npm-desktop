import { LoaderScreenComponent } from '../shared/components/molecules/loader-screen/loader-screen.component';
import { DisplayToastComponent } from '../shared/components/molecules/display-toast/display-toast.component';
import { BarTitleComponent } from '@shared/components/molecules/bar-title/bar-title.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LoaderScreenComponent,
    DisplayToastComponent,
    BarTitleComponent,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
