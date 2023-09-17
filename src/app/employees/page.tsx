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
import { removeItem, replaceItem } from '../../lib/utils';
import { Employee } from './Employee';

export default function Employees(): JSX.Element {
  const globalEmployees = React.useContext(EmployeesContext)!;
  const saveEmployees = React.useContext(EmployeesSaveContext);
  const [employees, setEmployees] = React.useState(globalEmployees);

  // FIXME: if trying to delete an employee with data, hide it instead
  const router = useRouter();
  return (
    <>
      <H1>{localization.editEmployees}</H1>
      <Form
        onSubmit={(): void =>
          loading(saveEmployees(employees).then(() => router.push('../')))
        }
        className="flex-1"
      >
        <Table.Container className="grid-cols-[repeat(4,auto),min-content] gap-2">
          <TableHeader />
          <Table.Body>
            {employees.map((employee, index) => (
              <Employee
                key={index}
                employee={employee}
                onChange={(employee): void =>
                  setEmployees(
                    employee === undefined
                      ? removeItem(employees, index)
                      : replaceItem(employees, index, employee),
                  )
                }
              />
            ))}
          </Table.Body>
        </Table.Container>
        <span className="-mt-4 flex-1" />
        <div className="flex flex-wrap gap-2">
          <Button.Info
            onClick={(): void =>
              setEmployees([
                ...employees,
                {
                  name: '',
                  revenueSharePercentage: 0,
                  baseSalary: 0,
                  isActive: true,
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
        <Table.Header scope="col">{localization.name}</Table.Header>
        <Table.Header scope="col">{localization.salaryPercentage}</Table.Header>
        <Table.Header scope="col">{localization.baseSalary}</Table.Header>
        <Table.Header scope="col">{localization.isActive}</Table.Header>
        <Table.Header scope="col">
          <span className="sr-only">{localization.delete}</span>
        </Table.Header>
      </Table.Row>
    </Table.Head>
  );
}
