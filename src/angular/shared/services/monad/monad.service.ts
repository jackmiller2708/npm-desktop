import { Injectable } from '@angular/core';
import { IOMonad } from './models/io.monad';
import { Either } from './models/either.monad';
import { State } from './models/state.monad';

@Injectable({ providedIn: 'root' })
export class MonadService {
  constructor() {}

  io<T>(effect: () => T): IOMonad<T> {
    return new IOMonad(effect);
  }

  either<L, R>(): typeof Either<L, R> {
    return Either<L, R>;
  }

  state<T, K>(value: K): State<T, K> {
    return State.of<T, K>(value);
  }
}
