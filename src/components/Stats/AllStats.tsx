import React from 'react';
import { LoadingBar } from '../Molecules/Loading';
import { StatCell, useAllStats } from './fetch';
import { GroupByChooser } from './GroupByChooser';
import { StatsChart } from './MonthStats';
import { BaseEmployeesCharts } from './YearStats';
import { f } from '../../lib/functools';
import { RA, IR } from '../../lib/types';
import { EmployeesContext } from '../../app/employees';
import { useStale } from '../Hooks/useStale';

export function AllStats(): JSX.Element {
  const { value: data, isStale } = useStale(useAllStats());

  return (
    <>
      {isStale && <LoadingBar />}
      {typeof data === 'object' && (
        <GroupByChooser>
          {(groupBy) =>
            groupBy === 'date' ? (
              <YearsCharts data={data} />
            ) : (
              <EmployeesCharts data={data} />
            )
          }
        </GroupByChooser>
      )}
    </>
  );
}

function EmployeesCharts({
  data,
}: {
  readonly data: RA<IR<StatCell>>;
}): JSX.Element {
  const labeledData = React.useMemo(
    () =>
      data.map((years) =>
        Object.entries(years).map(([year, data]) => ({
          ...data,
          label: year,
        })),
      ),
    [data],
  );
  return <BaseEmployeesCharts data={labeledData} />;
}

export function YearsCharts({
  data,
}: {
  readonly data: RA<IR<StatCell>>;
}): JSX.Element {
  const employees = React.useContext(EmployeesContext)!;
  const transposedData = React.useMemo(() => {
    const years = data.flatMap(Object.keys).map(f.parseInt);
    const minYear = f.min(...years);
    const maxYear = f.max(...years);
    if (minYear === undefined || maxYear === undefined) return [];
    return f.between(minYear, maxYear + 1, (year) => ({
      year,
      data: data.map(
        (employeeYears, index) =>
          employeeYears[year] ?? {
            revenue: 0,
            expenses: 0,
            salary: 0,
            label: employees[index].name,
            employeeId: employees[index].id,
          },
      ),
    }));
  }, [data, employees]);

  return (
    <>
      {transposedData.map(({ year, data }, index) => (
        <section key={index}>
          <StatsChart title={year.toString()} data={data} />
        </section>
      ))}
    </>
  );
}
