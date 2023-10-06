import React from 'react';
import { Button } from '../Atoms/Button';
import { localization } from '../../const/localization';

export function GroupByChooser({
  children,
}: {
  readonly children: (groupBy: 'date' | 'employee') => JSX.Element;
}): JSX.Element {
  const [groupBy, setGroupBy] = React.useState<'date' | 'employee'>('employee');
  const id = React.useId();
  return (
    <>
      <nav className="flex flex-wrap gap-2 items-center">
        {localization.groupBy}
        <Button.Info
          aria-pressed={groupBy === 'date' ? true : undefined}
          aria-controls={id}
          onClick={(): void => setGroupBy('date')}
        >
          {localization.date}
        </Button.Info>
        <Button.Info
          aria-pressed={groupBy === 'employee' ? true : undefined}
          aria-controls={id}
          onClick={(): void => setGroupBy('employee')}
        >
          {localization.employee}
        </Button.Info>
      </nav>
      <div id={id} className="flex flex-col xl:grid grid-cols-2 gap-8">
        {children(groupBy)}
      </div>
    </>
  );
}
