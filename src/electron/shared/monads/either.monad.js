/**
 * Represents the Left side of the Either monad.
 *
 * @template L
 * @param {L} value - The value on the Left side.
 * @returns {{
*   map: <R>(fn: (value: L) => R) => Left<L>,
*   chain: <R>(fn: (value: L) => Right<R>) => Left<L>,
*   fold: <R>(leftFn: (value: L) => R, rightFn: (value: any) => R) => R,
*   isLeft: boolean,
*   isRight: boolean,
* }} - An object representing the Left side of the Either monad.
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
   * @template R
   * @param {(value: L) => R} _ - The function to apply to the value (ignored for Left).
   * @returns {Left<L>} - A new Left with the same value.
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
 * Represents the Right side of the Either monad.
 *
 * @template R
 * @param {R} value - The value on the Right side.
 * @returns {{
*   map: <T>(fn: (value: R) => T) => Right<T>,
*   chain: <T>(fn: (value: R) => Right<T>) => Right<T>,
*   fold: <T>(leftFn: (value: any) => T, rightFn: (value: R) => T) => T,
*   isLeft: boolean,
*   isRight: boolean,
* }} - An object representing the Right side of the Either monad.
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
