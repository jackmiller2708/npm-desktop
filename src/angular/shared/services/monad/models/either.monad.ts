export class Either<L, R> {
  private constructor(
    private readonly _value: L | R,
    private readonly _isRight: boolean
  ) {}

  map<T>(fn: (value: R) => T): Either<L, T> {
    return this._isRight
      ? new Either<L, T>(fn(this._value as R), true)
      : new Either<L, T>(this._value as L, false);
  }

  chain<T>(fn: (value: R) => Either<L, T>) {
    return this._isRight
      ? fn(this._value as R)
      : new Either(this._value as L, false);
  }

  fold<T>(onLeft: (value: L) => T, onRight: (value: R) => T): T {
    return this._isRight ? onRight(this._value as R) : onLeft(this._value as L);
  }

  static right<L, R>(value: R): Either<L, R> {
    return new Either<L, R>(value, true);
  }

  static left<L, R>(error: L): Either<L, R> {
    return new Either<L, R>(error, false);
  }
}

