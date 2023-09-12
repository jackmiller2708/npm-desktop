import { Observable, Subscriber } from 'rxjs';
import { Injectable } from '@angular/core';

import * as childProcess from 'child_process';

@Injectable({ providedIn: 'root' })
export class ProcessService {
  private readonly _process: typeof childProcess;

  constructor() {
    this._process = window.require('child_process');
  }

  execute(command: string, args: string[], options?: childProcess.SpawnOptionsWithoutStdio) {
    return new Observable<string>((subscriber: Subscriber<string>) => {
      const process = this._process.spawn(command, args, options);

      process.on('message', (output: Uint16Array) => subscriber.next(output.toString()));

      process.on('error', (err: string) => subscriber.error(err));

      process.on('close', () => subscriber.complete());
    });
  }
}
