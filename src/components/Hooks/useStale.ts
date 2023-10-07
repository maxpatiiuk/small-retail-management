import React from 'react';

export function useStale<T>(value: T | undefined): {
  readonly value: T | undefined;
  readonly isStale: boolean;
} {
  const previousValueRef = React.useRef(value);
  if (value !== undefined) previousValueRef.current = value;
  return {
    value: previousValueRef.current,
    isStale: value === undefined || value !== previousValueRef.current,
  };
}
