import React from 'react';
import { Table } from '../Atoms/Table';
import { localization } from '../../const/localization';
import { RA } from '../../lib/types';
import { View } from '../../app/(entries)/[[...segments]]/useSegments';
import {
  firstDayOfWeek,
  months,
  weekDays,
} from '../Atoms/Internationalization';
import { DAY, WEEK } from '../Atoms/timeUnits';
import { CellEdit, ColumnsEdit } from './ColumnsEdit';
import { Form } from '../Atoms';
import { Button } from '../Atoms/Button';
import { ColumnsData, useColumnsData } from './useColumnsData';
import { Submit } from '../Atoms/Submit';
import { LoadingBar, loading } from '../Molecules/Loading';
import { className } from '../Atoms/className';
import { EmployeesContext } from '../../app/employees';
import { useStale } from '../Hooks/useStale';
import { UtcDate } from '../../lib/UtcDate';

export function ColumnsContent({
  view,
  date,
}: {
  readonly view: View;
  readonly date: UtcDate;
}): JSX.Element {
  const daysCount = (view === 'day' ? DAY : WEEK) / DAY;
  const weekDays = useWeekDays(daysCount, date);

  const {
    columnsData: currentColumnsData,
    setColumnsData,
    onReset: handleReset,
    onSave: handleSave,
  } = useColumnsData(weekDays);
  const { value: columnsData, isStale } = useStale(currentColumnsData);

  const employees = React.useContext(EmployeesContext);

  return (
    <>
      {isStale && <LoadingBar />}
      {typeof columnsData === 'object' && (
        <Form className="contents" onSubmit={(): void => loading(handleSave())}>
          <Table.Container
            className={className.strippedTable}
            style={
              { '--column-count': employees.length } as React.CSSProperties
            }
          >
            <TableHeader weekDays={weekDays} />
            <ColumnsEdit columnsData={columnsData} onChange={setColumnsData} />
            {columnsData.length > 1 && <SumRow columnsData={columnsData} />}
          </Table.Container>
          <div className="flex gap-2 justify-between">
            <Button.Danger onClick={handleReset}>
              {localization.cancel}
            </Button.Danger>
            <Submit.Success>{localization.save}</Submit.Success>
          </div>
        </Form>
      )}
    </>
  );
}

export type WeekDay = {
  readonly date: UtcDate;
  readonly weekDay: string;
};

function useWeekDays(daysCount: number, currentDate: UtcDate): RA<WeekDay> {
  return React.useMemo(() => {
    const firstDay = currentDate.clone();
    firstDay.dayOfWeek =
      firstDayOfWeek === 0 ? 0 : firstDay.dayOfWeek === 0 ? -6 : 1;

    const dates =
      daysCount === 1
        ? [currentDate]
        : Array.from({ length: daysCount }, (_, index) => {
            const date = firstDay.clone();
            date.day += index;
            return date;
          });

    return dates.map((date) => ({
      date,
      weekDay: weekDays[date.dayOfWeek],
    }));
  }, [daysCount, currentDate]);
}

function TableHeader({
  weekDays,
}: {
  readonly weekDays: RA<WeekDay>;
}): JSX.Element {
  const employees = React.useContext(EmployeesContext);
  const dateLabel = React.useMemo(
    () =>
      Array.from(new Set(weekDays.map(({ date }) => date.month)))
        .map((monthIndex) => months[monthIndex])
        .join(' - '),
    [weekDays],
  );
  return (
    <Table.Head>
      <Table.Row>
        <Table.Header scope="col">{dateLabel}</Table.Header>
        {employees.map(({ name }, index) => (
          <Table.Header key={index} scope="col">
            {name}
          </Table.Header>
        ))}
      </Table.Row>
    </Table.Head>
  );
}

function SumRow({
  columnsData,
}: {
  readonly columnsData: RA<ColumnsData> | undefined;
}): JSX.Element {
  const summed = useSummed(columnsData);
  return (
    <Table.Footer>
      <Table.Row className={className.specialRow}>
        <Table.Header scope="row">{localization.total}</Table.Header>
        {summed.map(({ employee, entry }, dayIndex) => (
          <CellEdit
            key={dayIndex}
            employee={employee}
            isToday={false}
            itemKey={undefined}
            entry={entry}
            onChange={undefined}
          />
        ))}
      </Table.Row>
    </Table.Footer>
  );
}

const fakeDate = UtcDate.fromNow();
function useSummed(columnsData: RA<ColumnsData> | undefined) {
  const employees = React.useContext(EmployeesContext);
  return React.useMemo(
    () =>
      employees.map((employee) => ({
        employee,
        entry: (columnsData ?? []).reduce(
          (total, { data }) => {
            const entry = data.find(
              ({ employee: { id } }) => id === employee.id,
            )?.entry;
            return {
              ...total,
              revenue: total.revenue + (entry?.revenue ?? 0),
              expenses: total.expenses + (entry?.expenses ?? 0),
            };
          },
          { revenue: 0, expenses: 0, employeeId: employee.id!, date: fakeDate },
        ),
      })),
    [columnsData, employees],
  );
}
