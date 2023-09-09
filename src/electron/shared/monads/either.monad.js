/**
 * Represents the Left side of the Either monad.
 *
 * @template L
 * @typedef {Object} LeftMonad
 * @property {(fn: (value: L) => any) => LeftMonad<L>} map - Maps over the Left side of the Either monad,
 *   producing a new Left with the same value.
 * @property {(fn: (value: L) => RightMonad<R>) => LeftMonad<L>} chain - Chains a function over the Left side
 *   of the Either monad, producing a new Left with the same value.
 * @property {(leftFn: (value: L) => R, rightFn: (value: any) => R) => R} fold - Folds (reduces) the Left side
 *   of the Either monad using the provided functions.
 * @property {boolean} isLeft - Indicates that this is a Left value.
 * @property {boolean} isRight - Indicates that this is not a Right value.
 */

/**
 * Represents the Right side of the Either monad.
 *
 * @template R
 * @typedef {Object} RightMonad
 * @property {(fn: (value: R) => T) => RightMonad<T>} map - Maps over the Right side of the Either monad,
 *   producing a new Right with the transformed value.
 * @property {(fn: (value: R) => RightMonad<T>) => RightMonad<T>} chain - Chains a function over the Right side
 *   of the Either monad, producing a new Right with the transformed value.
 * @property {(leftFn: (value: any) => T, rightFn: (value: R) => T) => T} fold - Folds (reduces) the Right side
 *   of the Either monad using the provided functions.
 * @property {boolean} isLeft - Indicates that this is not a Left value.
 * @property {boolean} isRight - Indicates that this is a Right value.
 */

/**
 * Either monad for handling values that can be either Left or Right.
 *
 * @template L, R
 * @typedef {Object} EitherMonad
 * @property {LeftMonad<L>} Left - Represents the Left side of the Either monad.
 * @property {RightMonad<R>} Right - Represents the Right side of the Either monad.
 */

/**
 * Creates a Left instance of the Either monad.
 *
 * @template L
 * @param {L} value - The value on the Left side.
 * @returns {LeftMonad<L>} An object representing the Left side of the Either monad.
 */
const Left = (value) => ({
  /**
   * Indicates that this is a Left value.
   * @type {boolean}
   */
  isLeft: true,

  /**
   * Indicates that this is not a Right value.
   * @type {boolean}
   */
  isRight: false,

  /**
   * Maps over the Left side of the Either monad, producing a new Left with the same value.
   *
   * @template L, R
   * @param {(value: L) => R} fn - The function to apply to the Left value.
   * @returns {LeftMonad<R>} A new Left with the same value.
   */
  map: (_) => Left(value),

  /**
   * Chains a function over the Left side of the Either monad, producing a new Left with the same value.
   *
   * @template R
   * @param {(value: L) => Right<R>} _ - The function to apply to the value (ignored for Left).
   * @returns {Left<L>} - A new Left with the same value.
   */
  chain: (_) => Left(value),

  /**
   * Folds (reduces) the Left side of the Either monad using the provided functions.
   *
   * @template R
   * @param {(value: L) => R} leftFn - The function to apply to the Left value.
   * @param {(value: any) => R} rightFn - The function to apply to the Right value (ignored for Left).
   * @returns {R} - The result of applying the appropriate function to the Left value.
   */
  fold: (leftFn, _) => leftFn(value),
});

/**
 * Creates a Right instance of the Either monad.
 *
 * @template R
 * @param {R} value - The value on the Right side.
 * @returns {RightMonad<R>} An object representing the Right side of the Either monad.
 */
const Right = (value) => ({
  /**
   * Indicates that this is not a Left value.
   * @type {boolean}
   */
  isLeft: false,

  /**
   * Indicates that this is a Right value.
   * @type {boolean}
   */
  isRight: true,

  /**
   * Maps over the Right side of the Either monad, producing a new Right with the transformed value.
   *
   * @template T
   * @param {(value: R) => T} fn - The function to apply to the value.
   * @returns {Right<T>} - A new Right with the transformed value.
   */
  map: (fn) => Right(fn(value)),

  /**
   * Chains a function over the Right side of the Either monad, producing a new Right with the transformed value.
   *
   * @template T
   * @param {(value: R) => Right<T>} fn - The function to apply to the value.
   * @returns {Right<T>} - A new Right with the transformed value.
   */
  chain: (fn) => fn(value),

  /**
   * Folds (reduces) the Right side of the Either monad using the provided functions.
   *
   * @template T
   * @param {(value: any) => T} leftFn - The function to apply to the Left value (ignored for Right).
   * @param {(value: R) => T} rightFn - The function to apply to the Right value.
   * @returns {T} - The result of applying the appropriate function to the Right value.
   */
  fold: (_, rightFn) => rightFn(value),
});

module.exports = { Either: { Left, Right } };
