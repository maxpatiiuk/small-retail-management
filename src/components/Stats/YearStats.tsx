import React from 'react';
import { RA } from '../../lib/types';
import { months } from '../Atoms/Internationalization';
import { LoadingBar } from '../Molecules/Loading';
import { StatCell, useYearStats } from './fetch';
import { GroupByChooser } from './GroupByChooser';
import { EmployeesContext } from '../../app/employees';
import { StatsChart } from './MonthStats';
import { f } from '../../lib/functools';
import { useStale } from '../Hooks/useStale';
import { UtcDate } from '../../lib/UtcDate';

export function YearStats({ date }: { readonly date: UtcDate }): JSX.Element {
  const { value: data, isStale } = useStale(useYearStats(date));

  return (
    <>
      {isStale && <LoadingBar />}
      {typeof data === 'object' && (
        <GroupByChooser>
          {(groupBy) =>
            groupBy === 'date' ? (
              <MonthsStats data={data} />
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
  readonly data: RA<RA<StatCell>>;
}): JSX.Element {
  const labeledData = React.useMemo(
    () =>
      f.transpose(data).map((monthsData) =>
        monthsData.map((month, index) => ({
          ...month,
          label: months[index + 1],
        })),
      ),
    [data],
  );
  return <BaseEmployeesCharts data={labeledData} />;
}

export function BaseEmployeesCharts({
  data,
}: {
  readonly data: RA<RA<StatCell>>;
}): JSX.Element {
  const employees = React.useContext(EmployeesContext)!;
  return (
    <>
      {data.map((months, index) => (
        <section key={index}>
          <StatsChart title={employees[index].name} data={months} />
        </section>
      ))}
    </>
  );
}

function MonthsStats({
  data,
}: {
  readonly data: RA<RA<StatCell>>;
}): JSX.Element {
  return (
    <>
      {data.map((employees, index) => (
        <section key={index}>
          <StatsChart title={months[index + 1]} data={employees} />
        </section>
      ))}
    </>
  );
}
