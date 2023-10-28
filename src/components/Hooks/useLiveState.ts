import React from 'react';
import { GetOrSet } from '../../lib/types';

/**
 * A synchronous version of useAsyncState
 * Like React.useMemo, but with setState
 *
 * @remarks
 * Like React.useState, but default value must always be a function, and when
 * function changes, default value is recalculated and reapplied.
 *
 * Thus, wrap the callback in React.useCallback with dependency array that
 * would determine when the state is recalculated.
 *
 * @example
 * This will call getDefaultValue to get new default value every time
 * dependency changes
 * ```js
 * const [value, setValue] = useLiveState(
 *   React.useCallback(
 *     getDefaultValue,
 *     [dependency]
 *   )
 * );
 * ```
 */
export function useLiveState<T>(callback: () => T): GetOrSet<T> {
  const previousCallback = React.useRef(callback);
  const defaultValue = React.useMemo(callback, [callback]);
  const [state, setState] = React.useState<T>(defaultValue);
  const stateRef = React.useRef(state);

  const updateState = React.useCallback<GetOrSet<T>[1]>((newValue) => {
    const resolvedValue =
      typeof newValue === 'function'
        ? (newValue as (oldValue: T) => T)(stateRef.current)
        : newValue;
    stateRef.current = resolvedValue;
    setState(resolvedValue);
  }, []);

  const hasChanged = previousCallback.current !== callback;
  if (hasChanged) {
    previousCallback.current = callback;
    updateState(defaultValue);
  }

  return [stateRef.current, updateState];
}
