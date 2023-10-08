import { collection, getDocs } from 'firebase/firestore';
import React from 'react';
import { EmployeesContext } from '../../app/employees';
import { Employee } from '../../app/employees/types';
import { IR, RA } from '../../lib/types';
import { useAsyncState } from '../Hooks/useAsyncState';
import { computeSalary } from '../WeekDay/statUtils';
import type { DeltaEntry } from '../WeekDay/syncAggregates';
import { localization } from '../../const/localization';
import { MONTH, YEAR } from '../Atoms/timeUnits';
import { db } from '../../lib/firestore';
import { BaseRecord, documentToData } from '../Hooks/useRecords';
import { f } from '../../lib/functools';
import { UtcDate } from '../../lib/UtcDate';

export type StatCell = DeltaEntry & {
  readonly salary: number;
  readonly label: string;
  readonly employeeId: string;
};

export function useMonthStats(date: UtcDate): RA<StatCell> | undefined {
  const employees = React.useContext(EmployeesContext);
  return useAsyncState(
    React.useCallback(
      () =>
        employees === undefined
          ? undefined
          : fetchMonthStats(employees, date.year, date.month),
      [employees, date.year, date.month],
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
  source: typeof MONTH | typeof YEAR,
): StatCell {
  const multiplier = source / MONTH;
  const salary =
    (revenue === 0 ? 0 : employee.baseSalary * multiplier) +
    computeSalary(employee, { revenue });

  return {
    label: employee.name,
    employeeId: employee.id!,
    revenue,
    expenses,
    salary,
  };
}

export function useYearStats(date: UtcDate): RA<RA<StatCell>> | undefined {
  const employees = React.useContext(EmployeesContext);
  return useAsyncState(
    React.useCallback(
      () =>
        employees === undefined
          ? undefined
          : Promise.all(
              f.between(1, YEAR / MONTH + 1, (month) =>
                fetchMonthStats(employees, date.year, month),
              ),
            ),
      [employees, date.year],
    ),
    true,
  )[0];
}

export function useAllStats(): RA<IR<StatCell>> | undefined {
  const employees = React.useContext(EmployeesContext);
  return useAsyncState(
    React.useCallback(() => f.maybe(employees, fetchAllStats), [employees]),
    true,
  )[0];
}

const fetchAllStats = async (
  employees: RA<Employee>,
): Promise<RA<IR<StatCell>>> =>
  Promise.all(
    employees.map((employee) =>
      getDocs(collection(db, 'yearSums', employee.id!, 'year'))
        .then((querySnapshot) => {
          const documents = Object.fromEntries(
            querySnapshot.docs
              .map((document) =>
                documentToData<DeltaEntry & BaseRecord>(document),
              )
              .map((document) => [document.id!, document] as const),
          );

          const years = Object.keys(documents).map(Number.parseInt);
          const minYear = Math.min(...years);
          const maxYear = Math.max(...years);
          return Object.fromEntries(
            f.between(minYear, maxYear + 1, (year) => [
              year,
              documentToStatCell(employee, documents[year], YEAR),
            ]),
          );
        })
        .catch((error) => {
          console.error(error, { employee });
          throw new Error(error);
        }),
    ),
  );

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
