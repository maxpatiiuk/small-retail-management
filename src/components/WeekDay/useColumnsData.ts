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
import { useToday } from '../Hooks/useToday';
import { UtcDate } from '../../lib/UtcDate';

export function useColumnsData(weekDays: RA<WeekDay>): {
  readonly columnsData: RA<ColumnsData> | undefined;
  readonly setColumnsData: (value: RA<ColumnsData>) => void;
  readonly onReset: () => void;
  readonly onSave: () => Promise<void>;
} {
  const employees = React.useContext(EmployeesContext);
  const [remoteColumnsData, setRemoteColumnsData] = useRemoteData(weekDays);

  const today = useToday();
  const getColumnsData = React.useCallback(
    () =>
      employees === undefined || remoteColumnsData === undefined
        ? undefined
        : indexColumnsData(remoteColumnsData, employees, weekDays, today),
    [employees, remoteColumnsData],
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
              syncAggregates,
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
  const lastDate = weekDay.at(-1)!.date;

  return useRecords<Entry>(
    React.useMemo(
      () =>
        query(
          collection(db, 'entries'),
          where('date', '>=', firstDate.unsafeDate),
          where('date', '<=', lastDate.unsafeDate),
        ),
      [firstDate, lastDate],
    ),
  );
}

const indexColumnsData = (
  remoteColumnData: RA<Entry>,
  employees: RA<Employee>,
  weekDays: RA<WeekDay>,
  today: UtcDate,
): RA<ColumnsData> =>
  weekDays.map((weekDay) => {
    const entries = remoteColumnData.filter(
      (entry) => entry.date.unixTimestamp === weekDay.date.unixTimestamp,
    );
    const data = employees.map((employee) => {
      const remoteEntry = entries.find(
        (entry) => entry.employeeId === employee.id,
      );

      const entry: Entry = remoteEntry ?? {
        id: undefined,
        employeeId: employee.id!,
        date: weekDay.date,
        revenue: 0,
        expenses: 0,
      };

      return { employee, entry };
    });

    return {
      weekDay,
      data,
      isToday: today.unixTimestamp === weekDay.date.unixTimestamp,
    };
  });

export type ColumnsData = {
  readonly weekDay: WeekDay;
  readonly data: RA<ColumnData>;
  readonly isToday: boolean;
};

type ColumnData = {
  readonly employee: Employee;
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
