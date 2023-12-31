import { RA, filterArray } from './types';

/**
 * A collection of helper functions for functional programming style
 * Kind of like underscore or ramda, but typesafe
 */
export const f = {
  /**
   * Call the second argument with the first if not undefined.
   * Else return undefined
   * Can replace undefined case with an alternative branch using nullish
   * coalescing operator:
   * ```js
   * f.maybe(undefinedOrNot, calledOnNotUndefined) ?? calledOnUndefined()
   * ```
   */
  maybe: <VALUE, RETURN>(
    value: VALUE | undefined | void,
    callback: (value: VALUE) => RETURN,
  ): RETURN | undefined => (value === undefined ? undefined : callback(value)),

  parseInt(value: string | undefined): number | undefined {
    if (value === undefined) return undefined;
    const number = Number.parseInt(value);
    return Number.isNaN(number) ? undefined : number;
  },

  /** Like f.parseInt, but for floats */
  parseFloat(value: string | undefined): number | undefined {
    if (value === undefined) return undefined;
    const number = Number.parseFloat(value);
    return Number.isNaN(number) ? undefined : number;
  },

  /**
   * A better typed version of Array.prototype.includes
   *
   * It allows first argument to be of any type, but if value is present
   * in the array, its type is changed using a type predicate
   */
  includes: <T>(array: RA<T>, item: unknown): item is T =>
    array.includes(item as T),

  min(...array: RA<number | undefined>): number | undefined {
    const data = filterArray(array);
    return data.length === 0 ? undefined : Math.min(...data);
  },

  max(...array: RA<number | undefined>): number | undefined {
    const data = filterArray(array);
    return data.length === 0 ? undefined : Math.max(...data);
  },

  transpose: <T>(array: RA<RA<T>>): RA<RA<T>> =>
    array[0].map((_, colIndex) => array.map((row) => row[colIndex])),

  between: <T>(
    min: number,
    max: number,
    callback: (value: number, index: number) => T,
  ): RA<T> =>
    Array.from({ length: max - min }, (_, index) =>
      callback(min + index, index),
    ),
} as const;
