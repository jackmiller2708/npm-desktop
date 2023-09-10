import { Observable, Subscriber } from 'rxjs';
import { ipcRenderer } from 'electron';
import { Injectable } from '@angular/core';

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
    return new Observable<T>((subscriber: Subscriber<T>): () => void => {
      const listener = (_: any, message: string) => subscriber.next(message ? JSON.parse(message) : message);

      this._ipcRenderer?.on(eventName, listener);

      return (): void => void this._ipcRenderer?.off(eventName, listener);
    });
  }
}
