'use client';

import { useRouter } from 'next/navigation';
import { Form, H1 } from '../Atoms';
import { Button } from '../Atoms/Buttons';
import { Link } from '../Atoms/Link';
import { Submit } from '../Atoms/Submit';
import { Table } from '../Atoms/Table';
import { localization } from '../const/localization';
import { loading } from '../Molecules/Loading';
import { EmployeesContext, EmployeesSaveContext } from '.';
import React from 'react';

export default function Employees(): JSX.Element {
  const globalEmployees = React.useContext(EmployeesContext)!;
  const saveEmployees = React.useContext(EmployeesSaveContext);
  const [employees, setEmployees] = React.useState(globalEmployees);

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
          <Table.Head>
            <Table.Row>
              <Table.Header scope="col">{localization.name}</Table.Header>
              <Table.Header scope="col">
                {localization.salaryPercentage}
              </Table.Header>
              <Table.Header scope="col">{localization.baseSalary}</Table.Header>
              <Table.Header scope="col">{localization.visible}</Table.Header>
              <Table.Header scope="col">
                <span className="sr-only">{localization.delete}</span>
              </Table.Header>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            <Table.Row></Table.Row>
          </Table.Body>
        </Table.Container>
        <span className="-mt-4 flex-1" />
        <div className="flex flex-wrap gap-2">
          <Button.Info>{localization.addEmployee}</Button.Info>
          <span className="-ml-2 flex-1" />
          <Link.Danger href="../">{localization.cancel}</Link.Danger>
          <Submit.Success>{localization.save}</Submit.Success>
        </div>
      </Form>
    </>
  );
}
