import React from 'react';
import { RA } from '../../lib/types';
import { WeekDay } from './ColumnsContent';
import { useColumnData } from './useColumnData';
import { EmployeesContext } from '../../app/employees';
import { Table } from '../Atoms/Table';

export function ColumnsEdit({
  weekDays,
}: {
  readonly weekDays: RA<WeekDay>;
}): JSX.Element {
  return (
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
  );
}
