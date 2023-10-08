import React from 'react';
import { Table } from '../Atoms/Table';
import { ColumnsData } from './useColumnsData';
import { RA } from '../../lib/types';
import { replaceItem } from '../../lib/utils';
import { Entry } from './types';
import { useLiveState } from '../Hooks/useLiveState';
import { localization } from '../../const/localization';
import { Input } from '../Atoms/Input';
import { Employee } from '../../app/employees/types';
import { formatCurrency } from '../Atoms/Internationalization';
import { computeSalary } from './statUtils';
import { UtcDate } from '../../lib/UtcDate';

export function ColumnsEdit({
  columnsData,
  onChange: handleChange,
}: {
  readonly columnsData: RA<ColumnsData>;
  readonly onChange: (columnsData: RA<ColumnsData>) => void;
}): JSX.Element {
  return (
    <Table.Body>
      {columnsData.map(({ isToday, weekDay, data }, employeeIndex) => (
        <Table.Row key={employeeIndex}>
          <Table.Header
            scope="row"
            className={isToday ? '!bg-green-100' : 'bg-white'}
          >{`${weekDay.date.day}, ${weekDay.weekDay}`}</Table.Header>
          {data.map(({ employee, entry }, dayIndex) => (
            <CellEdit
              key={dayIndex}
              employee={employee}
              isToday={isToday}
              date={weekDay.date}
              entry={entry}
              onChange={(entry): void =>
                handleChange(
                  replaceItem(columnsData, employeeIndex, {
                    weekDay,
                    isToday,
                    data: replaceItem(data, dayIndex, {
                      employee,
                      entry,
                    }),
                  }),
                )
              }
            />
          ))}
        </Table.Row>
      ))}
    </Table.Body>
  );
}

function CellEdit({
  employee,
  isToday,
  date,
  entry,
  onChange: handleChange,
}: {
  readonly isToday: boolean;
  readonly employee: Employee;
  readonly date: UtcDate;
  readonly entry: Entry;
  readonly onChange: (entry: Entry) => void;
}): JSX.Element {
  const isEmpty = entry.revenue === 0 && entry.expenses === 0;
  const [isManuallyOpen, setManuallyOpen] = useLiveState(
    React.useCallback(() => !isEmpty, [date.unixTimestamp]),
  );
  const isOpen = isManuallyOpen || !isEmpty;

  return (
    <Table.Cell
      className={`flex-col ${isToday ? '!bg-green-100' : 'bg-white'}`}
    >
      {isOpen ? (
        <EntryEdit employee={employee} entry={entry} onChange={handleChange} />
      ) : (
        <button
          type="button"
          onClick={(): void => setManuallyOpen(true)}
          aria-label={localization.clickToEdit}
          title={localization.clickToEdit}
          className="w-full h-full"
        />
      )}
    </Table.Cell>
  );
}

function EntryEdit({
  employee,
  entry,
  onChange: handleChange,
}: {
  readonly employee: Employee;
  readonly entry: Entry;
  readonly onChange: (entry: Entry) => void;
}): JSX.Element {
  const salary = React.useMemo(
    () => formatCurrency(computeSalary(employee, entry)),
    [employee, entry],
  );
  return (
    <>
      <Input.Currency
        placeholder={localization.revenue}
        aria-label={localization.revenue}
        value={entry.revenue}
        onValueChange={(revenue): void => handleChange({ ...entry, revenue })}
        className="!p-1"
      />
      <Input.Currency
        placeholder={localization.expenses}
        aria-label={localization.expenses}
        value={entry.expenses}
        onValueChange={(expenses): void => handleChange({ ...entry, expenses })}
        className="!p-1"
      />
      <Input.Text
        placeholder={localization.salary}
        aria-label={localization.salary}
        value={salary}
        readOnly
        className="!p-1"
      />
    </>
  );
}
