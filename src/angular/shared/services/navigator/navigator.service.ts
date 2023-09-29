import { NavigationExtras, Router } from '@angular/router';
import { Injectable, NgZone } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NavigatorService {
  constructor(
    // used with `_router.navigate` to mitigate the warning: "Navigation triggered outside Angular zone, did you forget to call 'ngZone.run()'?"
    private readonly _ngZone: NgZone,
    private readonly _router: Router
  ) {}

  navigate(commands: string[], extras?: NavigationExtras): Promise<boolean> {
    return this._ngZone.run(() => this._router.navigate(commands, extras));
  }
}
