import { ipcRenderer } from 'electron';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class InterProcessCommunicator {
  private readonly _ipcRenderer: typeof ipcRenderer | undefined;

  constructor() {
    this._ipcRenderer = window.require('electron').ipcRenderer;
  }

  send<T = unknown>(eventName: string, message?: T): void {
    this._ipcRenderer?.send(eventName, message);
  }

  on<T = unknown>(eventName: string): Observable<T> {
    return new Observable<T>((subscriber) => {
      const listener = (_: any, message: string) => subscriber.next(JSON.parse(message));

      this._ipcRenderer?.on(eventName, listener);

      return () => this._ipcRenderer?.off(eventName, listener);
    });
  }
}
