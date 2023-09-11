export interface IEitherMonad<E, A> {
  // The chain method allows you to sequence Either operations, handling both Left and Right cases.
  chain<B>(f: (a: A) => IEitherMonad<E, B> | B): IEitherMonad<E, B>;

  // The map method allows you to transform the value inside the Either if it's a Right (A) value.
  map<B>(f: (a: A) => B): IEitherMonad<E, B>;

  // The fold method allows you to pattern match on the Either, providing functions for both Left and Right cases.
  fold: <B>(onLeft: (e: E) => B, onRight: (a: A) => B) => B;
}