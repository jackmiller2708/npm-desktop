/**
 * The IO monad represents a computation that, when executed, produces a value.
 * It allows for the encapsulation of side effects and provides a way to sequence
 * and compose such computations in a pure functional manner.
 *
 * @param {() => any} effect - A function that encapsulates a side effect or computation.
 * @returns {{
 *   map: (fn: (a: any) => any) => IO,
 *   chain: (fn: (a: any) => IO) => IO,
 *   run: () => any
 * }} - An IO monad instance with map and chain methods for composing and executing
 * computations, and a run method to execute the encapsulated effect and produce a result.
 */
const IO = (effect) => ({
  /**
   * Maps over the result of the encapsulated effect, producing a new IO monad.
   *
   * @param {Function} fn - A function to apply to the result of the encapsulated effect.
   * @returns {IO} - A new IO monad with the effect modified by the provided function.
   */
  map: (fn) => IO(() => fn(effect())),

  /**
   * Chains a new IO monad computation after the encapsulated effect.
   *
   * @param {Function} fn - A function that produces a new IO monad to be executed sequentially.
   * @returns {IO} - A new IO monad that represents the sequential execution of the original
   * encapsulated effect followed by the effect produced by the provided function.
   */
  chain: (fn) => fn(effect()),

  /**
   * Executes the encapsulated effect and produces the result.
   *
   * @returns {any} - The result of executing the encapsulated effect.
   */
  run: effect,
});

module.exports = { IO };
