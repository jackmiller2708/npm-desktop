export class IOMonad<T> {
  constructor(private readonly _effect: () => T) {}

  private _apply<B>(fn: (a: T) => B | IOMonad<B>): IOMonad<B> {
    const result = fn(this._effect());

    return result instanceof IOMonad ? result : new IOMonad(() => result);
  }

  chain<B>(fn: (a: T) => IOMonad<B> | B): IOMonad<B> {
    return this._apply(fn);
  }

  map<B>(fn: (a: T) => B): IOMonad<B> {
    return this._apply(fn);
  }

  run(): T {
    return this._effect();
  }
}
