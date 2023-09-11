import { IEitherMonad } from '../interfaces/monad-either.interface';

export class EitherMonad<L, R> implements IEitherMonad<L, R> {
  constructor(private readonly _value: L | R) {}

  private apply<T>(fn: (a: R) => T | IEitherMonad<L, T>): IEitherMonad<L, T> {
    const result = fn(this._value as R);

    return result instanceof EitherMonad ? result : new EitherMonad(result);
  }

  chain<T>(fn: (a: R) => IEitherMonad<L, T> | T): IEitherMonad<L, T> {
    return this.apply(fn);
  }

  map<T>(fn: (a: R) => T): IEitherMonad<L, T> {
    return this.apply(fn);
  }

  fold<T>(onLeft: (e: L) => T, onRight: (a: R) => T): T {
    return this.isRight() ? onRight(this._value as R) : onLeft(this._value as L);
  }

  isRight(): boolean {
    return this._value !== undefined;
  }
}
