export class State<S, A> {
  constructor(private _run: (state: S) => [A, S]) {}

  // Chain operation to sequence computations
  chain<B>(f: (a: A) => State<S, B>): State<S, B> {
    return new State((state: S) => {
      const [a, nextState] = this._run(state);
      
      return f(a)._run(nextState);
    });
  }

  // Map operation to transform the result
  map<B>(f: (a: A) => B): State<S, B> {
    return this.chain((a) => State.of(f(a)));
  }

  // Extract the state and result
  run(initialState: S): [A, S] {
    return this._run(initialState);
  }

  // Static method to create a State with a constant result and unchanged state
  static of<S, A>(a: A): State<S, A> {
    return new State((state: S) => [a, state]);
  }
}