import React from 'react';
import { RA } from '../../lib/types';
import { months } from '../Atoms/Internationalization';
import { LoadingBar } from '../Molecules/Loading';
import { StatCell, useYearStats } from './fetch';
import { GroupByChooser } from './GroupByChooser';
import { EmployeesContext } from '../../app/employees';
import { StatsChart } from './MonthStats';
import { f } from '../../lib/functools';

export function YearStats({ date }: { readonly date: Date }): JSX.Element {
  const data = useYearStats(date);

  return data === undefined ? (
    <LoadingBar />
  ) : (
    <GroupByChooser>
      {(groupBy) =>
        groupBy === 'date' ? (
          <MonthsStats data={data} />
        ) : (
          <EmployeesCharts data={data} />
        )
      }
    </GroupByChooser>
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
          label: months[index],
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
          <StatsChart title={months[index]} data={employees} />
        </section>
      ))}
    </>
  );
}
