import { localization } from '../../const/localization';
import { RA } from '../../lib/types';
import { formatCurrency, months } from '../Atoms/Internationalization';
import { Table } from '../Atoms/Table';
import { className } from '../Atoms/className';
import { LoadingBar } from '../Molecules/Loading';
import { StatCell, useMonthStats, useSumStats } from './fetch';

export function MonthStats({ date }: { readonly date: Date }): JSX.Element {
  const data = useMonthStats(date);

  return data === undefined ? (
    <LoadingBar />
  ) : (
    <>
      <StatsTable date={date} data={data} />
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
  // BUG: sticky header top not working
  return (
    <Table.Container
      className={className.strippedTable}
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
  const year = date.getFullYear();
  const month = date.getMonth();
  return (
    <Table.Head>
      <Table.Row>
        <Table.Header scope="row">{`${months[month]} ${year}`}</Table.Header>
        <Table.Header scope="row">{localization.revenue}</Table.Header>
        <Table.Header scope="row">{localization.expenses}</Table.Header>
        <Table.Header scope="row">{localization.salary}</Table.Header>
      </Table.Row>
    </Table.Head>
  );
}

function TableRow({ data }: { readonly data: StatCell }): JSX.Element {
  return (
    <Table.Row>
      <Table.Header scope="col">{data.label}</Table.Header>
      <Table.Cell>{formatCurrency(data.revenue)}</Table.Cell>
      <Table.Cell>{formatCurrency(data.expenses)}</Table.Cell>
      <Table.Cell>{formatCurrency(data.salary)}</Table.Cell>
    </Table.Row>
  );
}
