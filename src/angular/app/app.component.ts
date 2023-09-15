import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  @HostBinding('class')
  private get _classes(): string[] {
    return ['h-screen', 'w-screen', 'block', 'flex', 'flex-col', 'items-center', 'justify-center', 'relative', 'overflow-hidden'];
  }
}
