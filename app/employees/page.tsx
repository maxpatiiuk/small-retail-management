'use client';

import { useRouter } from 'next/navigation';
import { Form } from '../Atoms';
import { Button } from '../Atoms/Buttons';
import { Link } from '../Atoms/Link';
import { Submit } from '../Atoms/Submit';
import { Table } from '../Atoms/Table';
import { localization } from '../const/localization';
import { loading } from '../Molecules/Loading';
import { useEmployees } from './useEmployees';

export default function Employees(): JSX.Element {
  const { employees, setEmployees, save } = useEmployees();
  const router = useRouter();
  return (
    <>
      <h1>{localization.editEmployees}</h1>
      <Form
        onSubmit={(): void => loading(save().then(() => router.push('../')))}
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
          <Submit.Success>{localization.save}</Submit.Success>
          <Link.Danger href="../">{localization.cancel}</Link.Danger>
        </div>
      </Form>
    </>
  );
}
