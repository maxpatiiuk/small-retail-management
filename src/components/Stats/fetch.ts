import { collection, getDocs } from 'firebase/firestore';
import React from 'react';
import { EmployeesContext } from '../../app/employees';
import { Employee } from '../../app/employees/types';
import { RA } from '../../lib/types';
import { useAsyncState } from '../Hooks/useAsyncState';
import { computeSalary } from '../WeekDay/statUtils';
import type { DeltaEntry } from '../WeekDay/syncAggregates';
import { localization } from '../../const/localization';
import { MONTH, YEAR } from '../Atoms/timeUnits';
import { db } from '../../lib/firestore';
import { BaseRecord, documentToData } from '../Hooks/useRecords';
import { f } from '../../lib/functools';

export type StatCell = DeltaEntry & {
  readonly salary: number;
  readonly label: string;
  readonly employeeId: string;
};

export function useMonthStats(date: Date): RA<StatCell> | undefined {
  const employees = React.useContext(EmployeesContext);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  return useAsyncState(
    React.useCallback(
      () =>
        employees === undefined
          ? undefined
          : fetchMonthStats(employees, year, month),
      [employees, year, month],
    ),
    true,
  )[0];
}

const fetchMonthStats = async (
  employees: RA<Employee>,
  year: number,
  month: number,
): Promise<RA<StatCell>> =>
  getDocs(
    collection(
      db,
      'monthSums',
      year.toString(),
      'month',
      month.toString(),
      'employee',
    ),
  ).then((querySnapshot) => {
    const documents = Object.fromEntries(
      querySnapshot.docs
        .map((document) => documentToData<DeltaEntry & BaseRecord>(document))
        .map((document) => [document.id!, document] as const),
    );

    return employees.map((employee) =>
      documentToStatCell(employee, documents[employee.id!], MONTH),
    );
  });

export function documentToStatCell(
  employee: Employee,
  { revenue = 0, expenses = 0 }: Partial<DeltaEntry> | undefined = {},
  source: number,
): StatCell {
  const multiplier = source / MONTH;
  const salary =
    employee.baseSalary + computeSalary(employee, { revenue }) * multiplier;

  return {
    label: employee.name,
    employeeId: employee.id!,
    revenue,
    expenses,
    salary,
  };
}

export function useYearStats(date: Date): RA<RA<StatCell>> | undefined {
  const employees = React.useContext(EmployeesContext);
  const year = date.getFullYear();
  return useAsyncState(
    React.useCallback(
      () =>
        employees === undefined
          ? undefined
          : Promise.all(
              f.between(1, YEAR / MONTH + 1, (month) =>
                fetchMonthStats(employees, year, month),
              ),
            ),
      [employees, year],
    ),
    true,
  )[0];
}

export function useSumStats(data: RA<StatCell>): Omit<StatCell, 'employeeId'> {
  return React.useMemo(
    () =>
      data.reduce(
        (total, current) => ({
          ...total,
          revenue: total.revenue + current.revenue,
          expenses: total.expenses + current.expenses,
          salary: total.salary + current.salary,
        }),
        { label: localization.total, revenue: 0, expenses: 0, salary: 0 },
      ),
    [data],
  );
}
