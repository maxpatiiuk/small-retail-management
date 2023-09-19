import React from 'react';
import { Table } from '../Atoms/Table';
import { ColumnsData } from './useColumnsData';
import { RA } from '../../lib/types';
import { replaceItem } from '../../lib/utils';
import { Entry } from './types';
import { useLiveState } from '../Hooks/useLiveState';
import { WeekDay } from './ColumnsContent';
import { localization } from '../../const/localization';
import { Input } from '../Atoms/Input';
import { Employee } from '../../app/employees/types';
import { formatCurrency } from '../Atoms/Internationalization';

export function ColumnsEdit({
  columnsData,
  onChange: handleChange,
}: {
  readonly columnsData: RA<ColumnsData>;
  readonly onChange: (columnsData: RA<ColumnsData>) => void;
}): JSX.Element {
  return (
    <Table.Body>
      {columnsData.map(({ employee, data }, employeeIndex) => (
        <Table.Row key={employeeIndex}>
          <Table.Header className="left-0 sticky" scope="row">
            {employee.name}
          </Table.Header>
          {data.map(({ weekDay, entry }, dayIndex) => (
            <CellEdit
              key={dayIndex}
              employee={employee}
              weekDay={weekDay}
              entry={entry}
              onChange={(entry): void =>
                handleChange(
                  replaceItem(columnsData, employeeIndex, {
                    employee,
                    data: replaceItem(data, dayIndex, {
                      weekDay,
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
  weekDay: { date, isToday },
  entry,
  onChange: handleChange,
}: {
  readonly employee: Employee;
  readonly weekDay: WeekDay;
  readonly entry: Entry;
  readonly onChange: (entry: Entry) => void;
}): JSX.Element {
  const dateString = React.useMemo(() => date.toLocaleDateString(), [date]);
  const isEmpty = entry.revenue === 0 && entry.expenses === 0;
  const [isManuallyOpen, setManuallyOpen] = useLiveState(
    React.useCallback(() => !isEmpty, [dateString]),
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

const computeSalary = (employee: Employee, entry: Entry): number =>
  (entry.revenue ?? 0) * (employee.incomeShare / 100);
