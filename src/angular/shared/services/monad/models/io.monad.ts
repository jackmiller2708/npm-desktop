import { IIOMonad } from '../interfaces/monad-io.interface';

export class IOMonad<T> implements IIOMonad<T> {
  constructor(private readonly _effect: () => T) {}

  private _apply<B>(fn: (a: T) => B | IIOMonad<B>): IIOMonad<B> {
    const result = fn(this._effect());

    return result instanceof IOMonad ? result : new IOMonad(() => result);
  }

  chain<B>(fn: (a: T) => IIOMonad<B> | B): IIOMonad<B> {
    return this._apply(fn);
  }

  map<B>(fn: (a: T) => B): IIOMonad<B> {
    return this._apply(fn);
  }

  run(): T {
    return this._effect();
  }
}
