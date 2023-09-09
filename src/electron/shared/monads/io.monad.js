/**
 * Represents a computation that, when executed, produces a value.
 * It allows for the encapsulation of side effects and provides a way to sequence
 * and compose such computations in a pure functional manner.
 *
 * @template T
 * @typedef {Object} IOMonad
 * @property {(fn: (result: T) => U) => IOMonad<T>} map - Maps over the result of the encapsulated effect,
 *   producing a new IO monad.
 * @property {(fn: (result: T) => IOMonad<U>) => IOMonad<T>} chain - Chains a new IO monad computation after
 *   the encapsulated effect.
 * @property {() => T} run - Executes the encapsulated effect and produces the result.
 */

/**
 * Creates an IO monad from an effect-producing function.
 *
 * @template T
 * @param {() => T} effect - A function that encapsulates a side effect or computation.
 * @returns {IOMonad<T>} An IO monad instance.
 */
const IO = (effect) => ({
  /**
   * Maps over the result of the encapsulated effect, producing a new IO monad.
   *
   * @template U
   * @param {(result: T) => U} fn - A function to apply to the result of the encapsulated effect.
   * @returns {IOMonad<U>} A new IO monad with the effect modified by the provided function.
   */
  map: (fn) => IO(() => fn(effect())),

  /**
   * Chains a new IO monad computation after the encapsulated effect.
   *
   * @template U
   * @param {(result: T) => IOMonad<U>} fn - A function that produces a new IO monad to be executed sequentially.
   * @returns {IOMonad<U>} A new IO monad that represents the sequential execution of the original
   * encapsulated effect followed by the effect produced by the provided function.
   */
  chain: (fn) => fn(effect()),

  /**
   * Executes the encapsulated effect and produces the result.
   *
   * @returns {T} The result of executing the encapsulated effect.
   */
  run: effect,
});

module.exports = { IO };
