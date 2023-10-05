import { DocumentSnapshot } from 'firebase/firestore';
import React from 'react';
import { EmployeesContext } from '../../app/employees';
import { Employee } from '../../app/employees/types';
import { RA } from '../../lib/types';
import { useAsyncState } from '../Hooks/useAsyncState';
import { computeSalary } from '../WeekDay/statUtils';
import { fetchMonthStat, DeltaEntry } from '../WeekDay/syncAggregates';
import { localization } from '../../const/localization';

export function useMonthStats(date: Date): RA<StatCell> | undefined {
  const employees = React.useContext(EmployeesContext);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  return useAsyncState(
    React.useCallback(
      () =>
        employees === undefined
          ? undefined
          : Promise.all(
              employees.map(async (employee) =>
                fetchMonthStat(
                  year.toString(),
                  month.toString(),
                  employee.id!,
                ).then(documentToStatCell.bind(undefined, employee)),
              ),
            ),
      [employees, year, month],
    ),
    true,
  )[0];
}

export function useSumStats(data: RA<StatCell>): StatCell {
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

export type StatCell = DeltaEntry & {
  readonly salary: number;
  readonly label: string;
};

export function documentToStatCell(
  employee: Employee,
  document: DocumentSnapshot<DeltaEntry>,
): StatCell {
  const data = document.data();
  const revenue = data?.revenue ?? 0;
  const expenses = data?.expenses ?? 0;
  const salary = employee.baseSalary + computeSalary(employee, { revenue });

  return {
    label: employee.name,
    revenue,
    expenses,
    salary,
  };
}
