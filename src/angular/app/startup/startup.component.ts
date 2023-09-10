import { Component, HostBinding } from '@angular/core';
import { NavItem } from 'src/angular/shared/components/molecules/item-nav/models/nav-item.model';

@Component({
  selector: 'app-startup',
  templateUrl: './startup.component.html',
  styleUrls: ['./startup.component.scss'],
})
export class StartupComponent {
  readonly navItems: NavItem[];

  @HostBinding('class')
  private get _classes(): string[] {
    return ['max-w-[900px]', 'max-h-[750px]','flex', 'justify-center', 'w-full', 'h-full', 'p-10', 'gap-5'];
  }

  constructor() {
    this.navItems = [
      new NavItem({
        content: 'Workspaces',
        routerLink: 'workspaces',
        iconPath: 'M64 480H448c35.3 0 64-28.7 64-64V160c0-35.3-28.7-64-64-64H288c-10.1 0-19.6-4.7-25.6-12.8L243.2 57.6C231.1 41.5 212.1 32 192 32H64C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64z',
      }),
      new NavItem({
        content: 'Clone from Git',
        routerLink: 'from-git',
        iconPath: 'M80 104a24 24 0 1 0 0-48 24 24 0 1 0 0 48zm80-24c0 32.8-19.7 61-48 73.3v87.8c18.8-10.9 40.7-17.1 64-17.1h96c35.3 0 64-28.7 64-64v-6.7C307.7 141 288 112.8 288 80c0-44.2 35.8-80 80-80s80 35.8 80 80c0 32.8-19.7 61-48 73.3V160c0 70.7-57.3 128-128 128H176c-35.3 0-64 28.7-64 64v6.7c28.3 12.3 48 40.5 48 73.3c0 44.2-35.8 80-80 80s-80-35.8-80-80c0-32.8 19.7-61 48-73.3V352 153.3C19.7 141 0 112.8 0 80C0 35.8 35.8 0 80 0s80 35.8 80 80zm232 0a24 24 0 1 0 -48 0 24 24 0 1 0 48 0zM80 456a24 24 0 1 0 0-48 24 24 0 1 0 0 48z',
      }),
    ];
  }
}
