import React from 'react';
import { localization } from '../../const/localization';
import { RA } from '../../lib/types';
import { formatCurrency, months } from '../Atoms/Internationalization';
import { Table } from '../Atoms/Table';
import { className } from '../Atoms/className';
import { LoadingBar } from '../Molecules/Loading';
import { StatCell, useMonthStats, useSumStats } from './fetch';
import { BarChart } from './BarChart';

export function MonthStats({ date }: { readonly date: Date }): JSX.Element {
  const data = useMonthStats(date);

  return data === undefined ? (
    <LoadingBar />
  ) : (
    <>
      <StatsTable date={date} data={data} />
      <StatsChart title={dateToLabel(date)} data={data} />
    </>
  );
}

function StatsTable({
  date,
  data,
}: {
  readonly date: Date;
  readonly data: RA<StatCell>;
}): JSX.Element {
  const sum = useSumStats(data);
  return (
    <Table.Container
      className={`${className.strippedTable} !overflow-visible`}
      style={{ '--column-count': 3 } as React.CSSProperties}
    >
      <TableHeader date={date} />
      <Table.Body>
        {data.map((rowData, index) => (
          <TableRow key={index} data={rowData} />
        ))}
        <TableRow data={sum} />
      </Table.Body>
    </Table.Container>
  );
}

function TableHeader({ date }: { readonly date: Date }): JSX.Element {
  return (
    <Table.Head>
      <Table.Row>
        <Table.Header scope="row">{dateToLabel(date)}</Table.Header>
        <Table.Header scope="row">{localization.revenue}</Table.Header>
        <Table.Header scope="row">{localization.expenses}</Table.Header>
        <Table.Header scope="row">{localization.salary}</Table.Header>
      </Table.Row>
    </Table.Head>
  );
}

const dateToLabel = (date: Date) =>
  `${months[date.getMonth()]} ${date.getFullYear()}`;

function TableRow({
  data,
}: {
  readonly data: Omit<StatCell, 'employeeId'>;
}): JSX.Element {
  return (
    <Table.Row>
      <Table.Header scope="col">{data.label}</Table.Header>
      <Table.Cell>{formatCurrency(data.revenue)}</Table.Cell>
      <Table.Cell>{formatCurrency(data.expenses)}</Table.Cell>
      <Table.Cell>{formatCurrency(data.salary)}</Table.Cell>
    </Table.Row>
  );
}

const dataSetLabels = {
  revenue: localization.revenue,
  expenses: localization.expenses,
  salary: localization.salary,
};

export function StatsChart({
  title,
  data,
}: {
  readonly title: string;
  readonly data: RA<StatCell>;
}): JSX.Element {
  const labels = React.useMemo(() => data.map((cell) => cell.label), []);
  const dataSets = React.useMemo(
    () =>
      Object.entries(dataSetLabels).map(([key, label]) => ({
        label,
        data: data.map((cell) => cell[key]),
      })),
    [],
  );
  return <BarChart title={title} labels={labels} dataSets={dataSets} />;
}
