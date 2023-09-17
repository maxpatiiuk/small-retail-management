/**
 * A collection of helper functions for functional programming style
 * Kind of like underscore or ramda, but typesafe
 */
export const f = {
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
} as const;
