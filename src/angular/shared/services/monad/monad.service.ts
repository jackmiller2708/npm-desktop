import { EitherMonad } from './models/either.monad';
import { Injectable } from '@angular/core';
import { IOMonad } from './models/io.monad';

@Injectable({ providedIn: 'root' })
export class MonadService {
  constructor() {}

  io<T>(effect: () => T): IOMonad<T> {
    return new IOMonad(effect);
  }

  either<L, T>(value: T): EitherMonad<L, T> {
    return new EitherMonad<L, T>(value);
  }
}
