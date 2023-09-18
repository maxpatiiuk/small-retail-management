import React from 'react';
import { RA } from '../../lib/types';
import { WeekDay } from './ColumnsContent';
import { collection, query, where } from 'firebase/firestore';
import { db } from '../../lib/firestore';
import { useRecords } from '../Hooks/useRecords';
import { Entry } from './types';
import { EmployeesContext } from '../../app/employees';
import { useLiveState } from '../Hooks/useLiveState';
import { Employee } from '../../app/employees/types';
import { error } from '../../lib/utils';

export function useColumnData(weekDays: RA<WeekDay>): {
  readonly columnData: RA<ColumnsData> | undefined;
  readonly setColumnData: (value: RA<ColumnsData>) => void;
  readonly onReset: () => void;
  readonly onSave: () => Promise<void>;
} {
  const employees = React.useContext(EmployeesContext);
  const [remoteColumnData, setRemoteColumnData] = useRemoteData(weekDays);
  const getColumnData = React.useCallback(
    () =>
      employees === undefined || remoteColumnData === undefined
        ? undefined
        : indexColumnData(remoteColumnData, employees, weekDays),
    [weekDays, employees, remoteColumnData],
  );
  const [columnData, setColumnData] = useLiveState(getColumnData);

  return {
    columnData,
    setColumnData,
    onReset: React.useCallback(
      () => setColumnData(getColumnData),
      [setColumnData, getColumnData],
    ),
    onSave: React.useCallback(
      () =>
        columnData === undefined
          ? error("Column data hasn't not fetched yet")
          : setRemoteColumnData(flattenColumnData(columnData)),
      [setRemoteColumnData, columnData],
    ),
  };
}

function useRemoteData(
  weekDay: RA<WeekDay>,
): readonly [RA<Entry> | undefined, (newEntries: RA<Entry>) => Promise<void>] {
  const firstDate = weekDay[0].date;
  const lastDate = React.useMemo(() => {
    const lastDate = weekDay.at(-1)!.date;
    const nextDay = new Date(lastDate);
    nextDay.setDate(nextDay.getDate() + 1);
    return nextDay;
  }, [weekDay]);

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

const indexColumnData = (
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
        productCost: 0,
      };

      return { weekDay, entry };
    });

    return { employee, data };
  });

type ColumnsData = {
  readonly employee: Employee;
  readonly data: RA<ColumnData>;
};

type ColumnData = {
  readonly weekDay: WeekDay;
  readonly entry: Entry;
};

const flattenColumnData = (columnData: RA<ColumnsData>): RA<Entry> =>
  columnData
    .flatMap(({ data }) => data.map(({ entry }) => entry))
    .filter((entry) => entry.revenue !== 0 || entry.productCost !== 0);
