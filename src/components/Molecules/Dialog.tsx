import React from 'react';
import { H2 } from '../Atoms';

export function Dialog({
  header,
  children,
  buttons,
  onClose: handleClose,
}: {
  readonly header: string;
  readonly children: React.ReactNode;
  readonly buttons: JSX.Element | undefined;
  readonly onClose: (() => void) | undefined;
}): JSX.Element {
  const dialogRef = React.useRef<HTMLDialogElement | null>(null);
  React.useEffect(() => {
    dialogRef.current?.showModal();
    return (): void => dialogRef.current?.close();
  }, []);
  return (
    <dialog
      ref={dialogRef}
      className={`
        max-w-[min(90%,theme(spacing.96))]
        whitespace-normal rounded border-4 border-gray-300
        [&::backdrop]:bg-gray-400 [&::backdrop]:bg-opacity-50 [&>p]:m-0
      `}
      onKeyDown={(event): void =>
        event.key === 'Escape' ? handleClose?.() : undefined
      }
      onClick={(event): void =>
        event.target === dialogRef.current ? handleClose?.() : undefined
      }
    >
      <div className="flex flex-col gap-4 p-6">
        <H2>{header}</H2>
        {children}
        {buttons && <div className="flex justify-end">{buttons}</div>}
      </div>
    </dialog>
  );
}
