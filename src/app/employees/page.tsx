'use client';

import { useRouter } from 'next/navigation';
import { Form, H1 } from '../../components/Atoms';
import { Button } from '../../components/Atoms/Button';
import { Link } from '../../components/Atoms/Link';
import { Submit } from '../../components/Atoms/Submit';
import { Table } from '../../components/Atoms/Table';
import { localization } from '../../const/localization';
import { loading } from '../../components/Molecules/Loading';
import { EmployeesContext, EmployeesSaveContext } from '.';
import React from 'react';
import { removeItem, replaceItem, sortFunction } from '../../lib/utils';
import { EmployeeRow } from './EmployeeRow';
import type { Employee } from './types';
import { f } from '../../lib/functools';

export default function Employees(): JSX.Element {
  const globalEmployees = React.useContext(EmployeesContext)!;
  const saveEmployees = React.useContext(EmployeesSaveContext);
  const [employees, setEmployees] = React.useState(globalEmployees);

  const router = useRouter();

  const updateOrder = (currentOrder: number, newOrder: number): void =>
    setEmployees(
      employees
        .map((employee) => ({
          ...employee,
          order:
            employee.order === currentOrder
              ? newOrder
              : employee.order === newOrder
              ? currentOrder
              : employee.order,
        }))
        .sort(sortFunction(({ order }) => order)),
    );

  return (
    <>
      <H1>{localization.editEmployees}</H1>
      <Form
        onSubmit={(): void =>
          loading(
            saveEmployees(employees.map(normalize)).then(() =>
              router.push('../'),
            ),
          )
        }
        className="flex-1 overflow-hidden"
      >
        <Table.Container className="grid-cols-[repeat(5,auto)] gap-1 sm:gap-2">
          <TableHeader />
          <Table.Body>
            {employees.map((employee, index) => (
              <EmployeeRow
                key={index}
                employee={employee}
                onChange={(employee): void => {
                  setEmployees(
                    employee === undefined
                      ? removeItem(employees, index)
                      : replaceItem(employees, index, employee),
                  );
                }}
                onOrderUp={
                  index === 0
                    ? undefined
                    : () => updateOrder(employee.order, employee.order - 1)
                }
                onOrderDown={
                  index === employees.length - 1
                    ? undefined
                    : () => updateOrder(employee.order, employee.order + 1)
                }
              />
            ))}
          </Table.Body>
        </Table.Container>
        <div className="flex flex-wrap gap-2">
          <Button.Info
            onClick={(): void =>
              setEmployees([
                ...employees,
                {
                  name: '',
                  incomeShare: 0,
                  baseSalary: 0,
                  isActive: true,
                  order: f.max(...employees.map(({ order }) => order + 1)) ?? 1,
                },
              ])
            }
          >
            {localization.addEmployee}
          </Button.Info>
          <span className="-ml-2 flex-1" />
          <Link.Danger href="../">{localization.cancel}</Link.Danger>
          <Submit.Success>{localization.save}</Submit.Success>
        </div>
      </Form>
    </>
  );
}

function TableHeader(): JSX.Element {
  return (
    <Table.Head>
      <Table.Row>
        <Table.Header scope="col">{localization.order}</Table.Header>
        <Table.Header scope="col">{localization.name}</Table.Header>
        <Table.Header scope="col">{localization.incomeShare}</Table.Header>
        <Table.Header scope="col">{localization.baseSalary}</Table.Header>
        <Table.Header scope="col">{localization.isActive}</Table.Header>
      </Table.Row>
    </Table.Head>
  );
}

const normalize = ({
  incomeShare = 0,
  baseSalary = 0,
  ...rest
}: Employee): Employee => ({
  incomeShare,
  baseSalary,
  ...rest,
});
