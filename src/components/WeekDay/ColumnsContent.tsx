import React from 'react';
import { Table } from '../Atoms/Table';
import { localization } from '../../const/localization';
import { RA } from '../../lib/types';
import { View } from '../../app/(entries)/[[...segments]]/useSegments';
import { getFirstDayOfWeek, weekDays } from '../Atoms/Internationalization';
import { EmployeesContext } from '../../app/employees';
import { DAY, WEEK } from '../Atoms/timeUnits';
import { useToday } from '../Hooks/useToday';

export function ColumnsContent({
  view,
  date,
}: {
  readonly view: View;
  readonly date: Date;
}): JSX.Element {
  const employees = React.useContext(EmployeesContext)!;
  const daysCount = (view === 'day' ? DAY : WEEK) / DAY;
  const weekDays = useWeekDays(daysCount, date);
  return (
    <Table.Container
      className="grid-cols-[auto,repeat(var(--days-count),auto)] [&_:is(th,td)]:p-1 [&_:is(th,td)]:sm:p-2"
      style={
        {
          '--days-count': daysCount,
        } as React.CSSProperties
      }
    >
      <TableHeader weekDays={weekDays} />
      <Table.Body>
        {employees.map((employee, index) => (
          <Table.Row key={index}>
            <Table.Header scope="row">{employee.name}</Table.Header>
            {weekDays.map(({ date, isToday }, index) => (
              <Table.Cell
                key={index}
                className={isToday ? 'bg-green-100' : 'bg-white'}
              >
                {date.toString()}
              </Table.Cell>
            ))}
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Container>
  );
}

type WeekDay = {
  readonly date: Date;
  readonly weekDay: string;
  readonly isToday: boolean;
};

function useWeekDays(daysCount: number, currentDate: Date): RA<WeekDay> {
  const today = useToday();

  return React.useMemo(() => {
    const firstDay = getFirstDayOfWeek(currentDate);

    const dates =
      daysCount === 1
        ? [currentDate]
        : Array.from({ length: daysCount }, (_, index) => {
            const date = new Date(firstDay);
            date.setDate(firstDay.getDate() + index);
            return date;
          });

    const todayString = today.toLocaleDateString();
    return dates.map((date) => ({
      date,
      weekDay: weekDays[date.getDay()],
      isToday: todayString === date.toLocaleDateString(),
    }));
  }, [daysCount, currentDate, today]);
}

function TableHeader({
  weekDays,
}: {
  readonly weekDays: RA<WeekDay>;
}): JSX.Element {
  return (
    <Table.Head>
      <Table.Row>
        <Table.Header scope="col">{localization.employee}</Table.Header>
        {weekDays.map(({ weekDay, isToday }, index) => (
          <Table.Header
            key={index}
            scope="col"
            className={isToday ? 'bg-green-100' : 'bg-white'}
          >
            {weekDay}
          </Table.Header>
        ))}
      </Table.Row>
    </Table.Head>
  );
}
