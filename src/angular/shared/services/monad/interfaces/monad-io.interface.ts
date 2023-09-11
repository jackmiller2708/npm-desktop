export interface IIOMonad<A> {
  // The chain method allows you to sequence IO operations.
  chain<B>(f: (a: A) => IIOMonad<B> | B): IIOMonad<B>;

  // The map method allows you to transform the result of an IO operation.
  map<B>(f: (a: A) => B): IIOMonad<B>;

  // The run method executes the IO operation and returns the result.
  run: () => A;
}
