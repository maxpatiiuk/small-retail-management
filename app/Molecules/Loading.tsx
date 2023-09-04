import React from 'react';
import { RA } from '../lib/types';
import { localization } from '../const/localization';
import { Dialog } from './Dialog';

export const loading = (promise: Promise<unknown>): void => handler?.(promise);

let handler: ((promise: Promise<unknown>) => void) | undefined = undefined;

export function LoadingProvider(): JSX.Element | null {
  // Loading Context
  const holders = React.useRef<RA<number>>([]);
  const [isLoading, setLoading] = React.useState(false);
  const loadingHandler = React.useCallback(
    (promise: Promise<unknown>): void => {
      const holderId = Math.max(-1, ...holders.current) + 1;
      holders.current = [...holders.current, holderId];
      setLoading(true);
      promise
        .finally(() => {
          holders.current = holders.current.filter((item) => item !== holderId);
          if (holders.current.length === 0) setLoading(false);
        })
        .catch(console.error);
    },
    []
  );
  handler = loadingHandler;

  return isLoading ? (
    <Dialog
      header={localization.loading}
      buttons={undefined}
      onClose={undefined}
    >
      {localization.loading}
    </Dialog>
  ) : null;
}
