import React from 'react';
import { RA } from '../../lib/types';
import { WeekDay } from './ColumnsContent';
import { collection, query, where } from 'firebase/firestore';
import { db } from '../../lib/firestore';
import { Changelog, useRecords } from '../Hooks/useRecords';
import { Entry } from './types';
import { EmployeesContext } from '../../app/employees';
import { useLiveState } from '../Hooks/useLiveState';
import { Employee } from '../../app/employees/types';
import { error } from '../../lib/utils';
import { syncAggregates } from './syncAggregates';

export function useColumnsData(weekDays: RA<WeekDay>): {
  readonly columnsData: RA<ColumnsData> | undefined;
  readonly setColumnsData: (value: RA<ColumnsData>) => void;
  readonly onReset: () => void;
  readonly onSave: () => Promise<void>;
} {
  const employees = React.useContext(EmployeesContext);
  const [remoteColumnsData, setRemoteColumnsData] = useRemoteData(weekDays);
  const getColumnsData = React.useCallback(
    () =>
      employees === undefined || remoteColumnsData === undefined
        ? undefined
        : indexColumnsData(remoteColumnsData, employees, weekDays),
    [weekDays, employees, remoteColumnsData],
  );
  const [columnsData, setColumnsData] = useLiveState(getColumnsData);

  return {
    columnsData,
    setColumnsData,
    onReset: React.useCallback(
      () => setColumnsData(getColumnsData),
      [setColumnsData, getColumnsData],
    ),
    onSave: React.useCallback(
      () =>
        columnsData === undefined
          ? error("Column data hasn't been fetched yet")
          : setRemoteColumnsData(flattenColumnsData(columnsData)).then(
              syncAggregates.bind(undefined, weekDays),
            ),
      [setRemoteColumnsData, columnsData],
    ),
  };
}

function useRemoteData(
  weekDay: RA<WeekDay>,
): readonly [
  RA<Entry> | undefined,
  (newEntries: RA<Entry>) => Promise<Changelog<Entry>>,
] {
  const firstDate = weekDay[0].date;
  const lastDate = React.useMemo(() => {
    const lastDate = weekDay.at(-1)!.date;
    const nextDay = new Date(lastDate);
    nextDay.setDate(nextDay.getDate() + 1);
    return nextDay;
  }, [weekDay]);

  // FEAT: update the totals on save
  return useRecords<Entry>(
    React.useMemo(
      () =>
        query(
          collection(db, 'entries'),
          where('date', '>=', firstDate),
          where('date', '<=', lastDate),
        ),
      [firstDate, lastDate],
    ),
  );
}

const indexColumnsData = (
  remoteColumnData: RA<Entry>,
  employees: RA<Employee>,
  weekDays: RA<WeekDay>,
): RA<ColumnsData> =>
  employees.map((employee) => {
    const entries = remoteColumnData.filter(
      (entry) => entry.employeeId === employee.id,
    );
    const data = weekDays.map((weekDay) => {
      const remoteEntry = entries.find(
        (entry) =>
          entry.date.toLocaleDateString() === weekDay.date.toLocaleDateString(),
      );

      const entry: Entry = remoteEntry ?? {
        id: undefined,
        employeeId: employee.id!,
        date: weekDay.date,
        revenue: 0,
        expenses: 0,
      };

      return { weekDay, entry };
    });

    return { employee, data };
  });

export type ColumnsData = {
  readonly employee: Employee;
  readonly data: RA<ColumnData>;
};

type ColumnData = {
  readonly weekDay: WeekDay;
  readonly entry: Entry;
};

const flattenColumnsData = (columnData: RA<ColumnsData>): RA<Entry> =>
  columnData
    .flatMap(({ data }) =>
      data.map(({ entry: { revenue = 0, expenses = 0, ...rest } }) => ({
        revenue,
        expenses,
        ...rest,
      })),
    )
    .filter((entry) => entry.revenue !== 0 || entry.expenses !== 0);
